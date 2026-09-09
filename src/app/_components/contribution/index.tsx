import BlurFade from "@/components/magicui/blur-fade"
import { SectionHeading } from "@/components/ui/section-heading"
import { getReadStats, getALLTimeSinceToday } from "@/services/visitor/wakatime"
import { getDuolingoProfile } from "@/services/visitor/duolingo"
import { getMonkeyTypeData } from "@/services/visitor/monkeytype"
import { GITHUB_ACCOUNTS } from "@/commons/constants/github"
import { fetchGithubData } from "@/services/visitor/github"
import GithubCalendar from "@/app/_components/contribution/github-calender"
import GithubOverview from "@/app/_components/contribution/github-overview"
import WakatimeActive from "@/app/_components/contribution/wakatime-active"
import WakatimeOverview from "@/app/_components/contribution/wakatime-overview"
import DuolingoStats from "./duolingo-stats"
import MonkeyTypeStats from "./monkeytype-stats"

export default async function ContributionSection() {
  const [readStatsResponse, allTimeSinceTodayResponse, duolingoProfile, typingData, github] =
    await Promise.all([
      getReadStats(),
      getALLTimeSinceToday(),
      getDuolingoProfile(),
      getMonkeyTypeData(),
      fetchGithubData(GITHUB_ACCOUNTS[0].username, GITHUB_ACCOUNTS[0].token),
    ])

  const wakatime = {
    ...readStatsResponse.data,
    all_time_since_today: allTimeSinceTodayResponse.data,
  }

  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <SectionHeading
          as="h3"
          eyebrow="Activity"
          title="@rizkyhaksono's"
          accent="contributions"
          description="Coding hours, GitHub streaks, and learning stats pulled live from around the web."
          className="mb-6"
        />
        <DuolingoStats duolingo={duolingoProfile} />
        <WakatimeOverview data={wakatime} />
        <WakatimeActive data={wakatime} />
        <GithubOverview data={github?.data?.contributionsCollection?.contributionCalendar} />
        <GithubCalendar data={github?.data?.contributionsCollection?.contributionCalendar} />
        <MonkeyTypeStats typingStats={typingData} />
      </div>
    </BlurFade>
  )
}
