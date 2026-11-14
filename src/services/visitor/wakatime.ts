import { STATS_ENDPOINT } from "@/commons/constants/watatime";

export const getReadStats = async (): Promise<{
  status: number;
  data: any;
}> => {
  // Public profile: no key. all_time is a large payload WakaTime may compute slowly, hence the longer wait.
  const response = await fetch(STATS_ENDPOINT, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(8000),
    method: "GET",
  });

  const status = response.status;

  if (status >= 400) return { status, data: [] };

  const getData = await response.json();

  const start_date = getData?.data?.start;
  const end_date = getData?.data?.end;
  const last_update = getData?.data?.modified_at;

  const categories = getData?.data?.categories;

  const best_day = {
    date: getData?.data?.best_day?.date,
    text: getData?.data?.best_day?.text,
  };
  const human_readable_daily_average =
    getData?.data?.human_readable_daily_average_including_other_language;
  const human_readable_total =
    getData?.data?.human_readable_total_including_other_language;

  const languages = getData?.data?.languages;
  const editors = getData?.data?.editors;

  return {
    status,
    data: {
      last_update,
      start_date,
      end_date,
      categories,
      best_day,
      human_readable_daily_average,
      human_readable_total,
      languages,
      editors,
    },
  };
};
