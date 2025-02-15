import type { NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'

interface Contribution {
  repo: string
  commits: string[]
}

export async function GET(
  req: NextRequest,
  res: NextApiResponse<Contribution[] | { message: string }>
) {
  const searchParams = new URL(req.url).searchParams
  const username = searchParams.get('username')

  if (!username || typeof username !== 'string') {
    return NextResponse.json({
      message: 'Username is required and must be a string'
    })
  }

  const query = `{
    user(login: "${username}") {
      repositories(first: 10) {
        nodes {
          name
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 10) {
                  nodes {   
                    oid
                    committedDate
                  }
                }
              }
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

    const commits =
      data.data?.user?.repositories?.nodes?.map((repo: any) => ({
        repo: repo.name,
        commits: repo.defaultBranchRef?.target.history.nodes || []
      })) || []
    return NextResponse.json(commits)
  } catch (error: any) {
    console.error('API Error:', error)
    res
      .status(500)
      .json({ message: error.message || 'Error fetching contributions' })
  }
}
