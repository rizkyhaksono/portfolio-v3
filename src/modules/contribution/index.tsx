import BlurFade from "@/components/magicui/blur-fade";
import { getReadStats, getALLTimeSinceToday } from "@/services/wakatime";
import { GITHUB_ACCOUNTS } from "@/commons/constants/github";
import { fetchGithubData } from "@/services/github";
import GithubCalendar from "@/modules/contribution/github-calender";
import GithubOverview from "@/modules/contribution/github-overview";
import WakatimeActive from "@/modules/contribution/wakatime-active";
import WakatimeOverview from "@/modules/contribution/wakatime-overview";

export default async function ContributionSection() {
  const readStatsResponse = await getReadStats();
  const allTimeSinceTodayResponse = await getALLTimeSinceToday();

  const wakatime = {
    ...readStatsResponse.data,
    all_time_since_today: allTimeSinceTodayResponse.data,
  };

  const github = await fetchGithubData(
    GITHUB_ACCOUNTS[0].username,
    GITHUB_ACCOUNTS[0].token
  );

  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">GitHub Contributions</p>
        <WakatimeOverview data={wakatime} />
        <WakatimeActive data={wakatime} />
        <GithubOverview
          data={github?.data?.contributionsCollection?.contributionCalendar}
        />
        <GithubCalendar
          data={github?.data?.contributionsCollection?.contributionCalendar}
        />
      </div>
    </BlurFade>
  )
}