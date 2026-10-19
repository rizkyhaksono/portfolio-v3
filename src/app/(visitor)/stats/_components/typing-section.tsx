import { PageSection } from "@/components/ui/page-section"
import { InkChart } from "@/components/ui/ink-chart"
import type { MonkeyTypePersonalBest, MonkeyTypeUserData } from "@/commons/types/monkeytype"

const WIB_MS = 7 * 3_600_000

// "2026-10-17 14:03:09" in Jakarta wall time: unique per test, and InkChart prints it as "17 Oct, 14:03".
const wallTime = (ms: number) => new Date(ms + WIB_MS).toISOString().slice(0, 19).replace("T", " ")

function timeAtKeyboard(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`
}

/** MonkeyType: best speed in a sentence, then the last ten personal bests (raw speed dashed). */
export default function TypingSection({ data }: Readonly<{ data: MonkeyTypeUserData }>) {
  // The 25-word personal-bests endpoint answers with a plain array, whatever the declared type says.
  const tests = [...(Array.isArray(data.personalBests) ? (data.personalBests as MonkeyTypePersonalBest[]) : [])]
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-10)
  const stats = data.stats
  if (data.bestWpm === 0 && !stats?.completedTests) return null

  return (
    <PageSection id="typing" heading={{ title: "Typing" }} contentClassName="mt-4 space-y-8">
      <p className="max-w-[60ch] text-body text-ink-soft">
        {data.bestWpm > 0 && (
          <>
            The best 25-word test on MonkeyType ran at <span className="font-display tabular-nums text-ink">{data.bestWpm}</span> words a
            minute with {data.bestAccuracy}% accuracy.{" "}
          </>
        )}
        {stats && stats.completedTests > 0 && (
          <>
            {stats.completedTests.toLocaleString("en")} of {stats.startedTests.toLocaleString("en")} tests finished, with{" "}
            {timeAtKeyboard(stats.timeTyping)} at the keyboard in all.
          </>
        )}
      </p>

      {tests.length > 1 && (
        <InkChart
          points={tests.map((t) => ({ x: wallTime(t.timestamp), y: Math.round(t.wpm) }))}
          dashed={tests.map((t) => ({ x: wallTime(t.timestamp), y: Math.round(t.raw) }))}
          name="Words a minute"
          dashedName="Raw"
          label="Words a minute on the last ten personal bests, raw speed dashed"
        />
      )}
    </PageSection>
  )
}
