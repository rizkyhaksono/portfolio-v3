"use client"

import { useCallback, useState } from "react"
import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { getJLPTLevels, getJLPTVoca, getJLPTQuiz } from "@/services/visitor/japanese"
import type { JLPTQuestion } from "@/commons/types/tools"
import { ToolError, ToolLoading, useToolData } from "./tool-status"

const QUIZ_LENGTH = 10
const loadLevels = () => getJLPTLevels().then((res) => res.levels)

export function JapaneseQuizTab() {
  const levels = useToolData(loadLevels)
  const [level, setLevel] = useState("N5")

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-small font-semibold text-ink">Level</legend>
        {levels.status === "error" ? (
          <div className="mt-2">
            <ToolError onRetry={levels.retry}>The JLPT levels did not load.</ToolError>
          </div>
        ) : levels.status === "loading" && !levels.data ? (
          <ToolLoading>Loading levels…</ToolLoading>
        ) : (
          <div className="mt-2 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
            {levels.data?.map((l) => (
              <Button
                key={l.code}
                type="button"
                variant={level === l.code ? "default" : "outline"}
                aria-pressed={level === l.code}
                onClick={() => setLevel(l.code)}
                className="h-auto w-full flex-col items-start gap-0 px-2 py-2 sm:w-auto sm:px-4"
              >
                {l.code}
                <span className="hyphens-auto whitespace-normal text-left text-caption font-normal">{l.name}</span>
              </Button>
            ))}
          </div>
        )}
      </fieldset>

      <Tabs defaultValue="vocabulary">
        <TabsList>
          <TabsTrigger value="vocabulary">Word list</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>
        <TabsContent value="vocabulary">
          <Vocabulary level={level} />
        </TabsContent>
        <TabsContent value="quiz">
          <Quiz level={level} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Vocabulary({ level }: Readonly<{ level: string }>) {
  const words = useToolData(useCallback(() => getJLPTVoca(level, 20).then((res) => res.words), [level]))

  if (words.status === "error") return <ToolError onRetry={words.retry}>The {level} word list did not load.</ToolError>
  if (words.status === "loading") return <ToolLoading>Loading {level} words…</ToolLoading>
  if (!words.data?.length) return <p className="font-display text-body text-ink-soft">No words for {level} yet.</p>

  return (
    <section aria-labelledby="jlpt-words">
      <h3 id="jlpt-words" className="font-display text-h3 text-ink">
        {level} vocabulary
      </h3>
      <p className="mt-1 font-display text-caption text-ink-soft">{words.data.length} words, with reading and meaning.</p>
      <LedgerList className="mt-4">
        {words.data.map((w, i) => (
          <LedgerRow
            key={`${w.word}-${i}`}
            titleAs="p"
            title={
              <>
                <span lang="ja" className="text-h3">
                  {w.word}
                </span>{" "}
                <span lang="ja" className="text-body text-ink-soft">
                  {w.reading}
                </span>
              </>
            }
          >
            <span className="text-ink">{w.meaning}</span>
            {w.partOfSpeech && <span>, {w.partOfSpeech}</span>}
          </LedgerRow>
        ))}
      </LedgerList>
    </section>
  )
}

function Quiz({ level }: Readonly<{ level: string }>) {
  const quiz = useToolData(useCallback(() => getJLPTQuiz(level, QUIZ_LENGTH).then((res) => res.questions), [level]))

  if (quiz.status === "error") return <ToolError onRetry={quiz.retry}>The {level} quiz did not load.</ToolError>
  // Loading unmounts the round, so each new set starts from a clean score.
  if (quiz.status === "loading" || !quiz.data) return <ToolLoading>Dealing {level} questions…</ToolLoading>
  if (quiz.data.length === 0) return <p className="font-display text-body text-ink-soft">No questions for {level} yet.</p>

  return <QuizRound questions={quiz.data} onAgain={quiz.retry} />
}

function QuizRound({ questions, onAgain }: Readonly<{ questions: JLPTQuestion[]; onAgain: () => void }>) {
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const total = questions.length

  if (index >= total) {
    const verdict =
      score === total ? (
        <>Every answer right. <span lang="ja">完璧!</span></>
      ) : score >= total * 0.7 ? (
        <>Well done. <span lang="ja">よくできました!</span></>
      ) : (
        <>Keep practising. <span lang="ja">がんばって!</span></>
      )
    return (
      <div role="status" className="space-y-4 border-t border-ink pt-6">
        <p className="font-display text-numeral tabular-nums text-ink">
          {score} of {total}
        </p>
        <p className="font-display text-lead text-ink-soft">
          {verdict} That is {Math.round((score / total) * 100)}% correct.
        </p>
        <Button onClick={onAgain}>New quiz</Button>
      </div>
    )
  }

  const q = questions[index]
  const right = choice === q.correct

  // The quiz payload already carries the answer, so checking is local: no round trip that can fail mid-quiz.
  const check = () => {
    if (!choice) return
    setAnswered(true)
    if (right) setScore((s) => s + 1)
  }

  const next = () => {
    setIndex((i) => i + 1)
    setChoice(null)
    setAnswered(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-caption tabular-nums text-ink-soft">
          Question {index + 1} of {total}. {score} right so far.
        </p>
        <span aria-hidden className="mt-2 block h-3 border border-rule-strong">
          <span className="bg-hatch block h-full border-r border-ink" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </span>
      </div>

      <fieldset>
        <legend className="w-full py-4">
          <span lang="ja" className="block font-display text-h1 text-ink">
            {q.word}
          </span>
          <span lang="ja" className="mt-2 block text-h4 text-ink-soft">
            {q.reading}
          </span>
          <span className="mt-4 block text-small text-ink-soft">What does this word mean?</span>
        </legend>

        <ul role="list" className="grid gap-2">
          {q.options.map((option, i) => {
            const picked = choice === option
            const isAnswer = answered && option === q.correct
            const isWrongPick = answered && picked && !isAnswer
            return (
              <li key={`${i}-${option}`}>
                <button
                  type="button"
                  aria-pressed={picked}
                  disabled={answered}
                  onClick={() => setChoice(option)}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 border p-3 text-left text-body transition-colors",
                    picked && !answered ? "border-ink bg-ink text-paper" : "border-rule-strong text-ink",
                    !answered && !picked && "hover:bg-tint",
                    isAnswer && "border-ink",
                  )}
                >
                  <span aria-hidden className="flex size-7 shrink-0 items-center justify-center border border-current text-small">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className={cn("flex-1", isWrongPick && "line-through")}>{option}</span>
                  {isAnswer && (
                    <span className="flex items-center gap-1 text-caption">
                      <Check aria-hidden strokeWidth={1.5} className="size-4" />
                      Answer
                    </span>
                  )}
                  {isWrongPick && (
                    <span className="flex items-center gap-1 text-caption">
                      <X aria-hidden strokeWidth={1.5} className="size-4" />
                      Your pick
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </fieldset>

      <p role="status" className="flex min-h-6 gap-2 font-display text-body text-ink">
        {answered && (
          <>
            {right ? <Check aria-hidden strokeWidth={1.5} className="mt-1 size-4 shrink-0" /> : <X aria-hidden strokeWidth={1.5} className="mt-1 size-4 shrink-0" />}
            {right ? "Correct." : `Not quite. It means “${q.correct}”.`}
          </>
        )}
      </p>

      {answered ? (
        <Button onClick={next} className="w-full" size="lg">
          {index + 1 < total ? "Next question" : "See your score"}
        </Button>
      ) : (
        <Button onClick={check} disabled={!choice} className="w-full" size="lg">
          Check answer
        </Button>
      )}
    </div>
  )
}
