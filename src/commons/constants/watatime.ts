// WakaTime no longer lets an API key read stats (403 "API Keys are only for plugins"), so the site reads the
// owner's public profile instead. Its public range is "all time"; widen it in WakaTime's profile settings to show more.
export const STATS_ENDPOINT = "https://wakatime.com/api/v1/users/@rizkyhaksono/stats/all_time";
