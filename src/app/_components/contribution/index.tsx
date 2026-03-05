import BlurFade from "@/components/magicui/blur-fade"
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
  const readStatsResponse = await getReadStats()
  const allTimeSinceTodayResponse = await getALLTimeSinceToday()
  const duolingoProfile = await getDuolingoProfile()
  const typingData = await getMonkeyTypeData()

  const wakatime = {
    ...readStatsResponse.data,
    all_time_since_today: allTimeSinceTodayResponse.data,
  }

  const github = await fetchGithubData(GITHUB_ACCOUNTS[0].username, GITHUB_ACCOUNTS[0].token)

  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <h3 className="text-base font-semibold text-foreground">@rizkyhaksono&apos;s Contributions</h3>
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
