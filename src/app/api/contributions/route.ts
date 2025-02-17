import type { NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'

interface Contribution {
  date: string
  count: number
}

export async function GET(
  req: NextRequest,
  _res: NextApiResponse<Contribution[] | { message: string }>
) {
  const searchParams = new URL(req.url).searchParams
  const username = searchParams.get('username')

  if (!username || typeof username !== 'string') {
    return NextResponse.json({
      message: 'Username is required and must be a string'
    })
  }

  // const query = `{
  //   user(login: "${username}") {
  //     contributionsCollection {
  //       contributionCalendar {
  //         weeks {
  //           contributionDays {
  //             date
  //             contributionCount
  //           }
  //         }
  //       }
  //     }
  //   }
  // }`
  const fromDate = '2024-01-01T00:00:00Z'
  const toDate = '2024-12-31T23:59:59Z'
  const query = `{
    user(login: "${username}") {
      contributionsCollection(from: "${fromDate}", to: "${toDate}") {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }`

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      )
    }

    const data = await response.json()

    if (
      !data.data ||
      !data.data.user ||
      !data.data.user.contributionsCollection ||
      !data.data.user.contributionsCollection.contributionCalendar
    ) {
      throw new Error('Invalid data structure received from GitHub API.')
    }

    const days =
      data.data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
        (week: any) => week.contributionDays
      )

    return NextResponse.json(days)
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({
      message: error.message || 'Error fetching contributions'
    })
  }
}
