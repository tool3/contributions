import { retrieveContributionData } from '~/components/github/github'

type Props = {
  userName: string
  totalContributions: number
  contributionDays: Externals.Github.ContributionDay[]
}

const Page = (props: Props) => {
  console.log({ props })
  return <h1>hello</h1>
}

Page.getInitialProps = async (context) => {
  const userName = (context.query['user_name'] as string) || 'tool3'
  const {
    data: {
      user: {
        contributionsCollection: {
          contributionCalendar: { totalContributions, weeks }
        }
      }
    }
  } = await retrieveContributionData(userName)
  const contributionDays = weeks.reduce((prev, cur) => {
    return prev.concat(cur.contributionDays)
  }, [] as Externals.Github.ContributionDay[])
  return {
    userName,
    totalContributions,
    contributionDays
  }
}

export default Page
