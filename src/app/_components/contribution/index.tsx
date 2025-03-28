import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";
import { getReadStats, getALLTimeSinceToday } from "@/services/visitor/wakatime";
import { GITHUB_ACCOUNTS } from "@/commons/constants/github";
import { fetchGithubData } from "@/services/visitor/github";
import GithubCalendar from "@/app/_components/contribution/github-calender";
import GithubOverview from "@/app/_components/contribution/github-overview";
import WakatimeActive from "@/app/_components/contribution/wakatime-active";
import WakatimeOverview from "@/app/_components/contribution/wakatime-overview";

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
        <Link
          className="text-lg font-semibold underline underline-offset-4"
          href={"https://github.com/rizkyhaksono"}
          target="_blank"
        >
          {`@rizkyhaksono's contributions`}
        </Link>
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