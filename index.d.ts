declare module '*.mp3'
declare module '*.glsl'

declare namespace Externals {
  namespace Github {
    type ContributionDay = {
      contributionCount: number
      date: string
    }

    type ApiResponse = {
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: number
              weeks: {
                contributionDays: ContributionDay[]
              }[]
            }
          }
        }
      }
    }
  }
}
