"use client"

import { cn } from "@/lib/utils"
import { useLayoutEffect, useRef, useState } from "react"

interface Contribution {
  date: string
  contributionCount: number
  color: string
}

interface Month {
  name: string
  firstDay: string
  totalWeeks: number
  contributionsCount: number
}

interface GithubCalendarProps {
  data?: {
    weeks: {
      firstDay: string
      contributionDays: Contribution[]
    }[]
    months: Month[]
    colors: string[]
  }
}

const CELL_SIZE_PX = 12
const CELL_GAP_PX = 3
const WEEK_COLUMN_PX = CELL_SIZE_PX + CELL_GAP_PX

/**
 * Pins the heatmap to the newest week so mobile viewports show the current
 * streak first; older months remain reachable by scrolling left.
 */
const scrollToNewestWeek = (node: HTMLDivElement | null) => {
  if (!node) return
  node.scrollLeft = node.scrollWidth
}

const GithubCalendar = ({ data }: GithubCalendarProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectContribution, setSelectContribution] = useState<{
    count: number | null
    date: string | null
  }>({
    count: null,
    date: null,
  })

  const weeks = data?.weeks ?? []
  const months =
    data?.months?.map((month: Month) => {
      const filterContributionDay = weeks
        .filter((week) => week.firstDay.slice(0, 7) === month.firstDay.slice(0, 7))
        .map((item) => item.contributionDays)
        .flat(1)
      const getContributionsByMonth = filterContributionDay.reduce((previousValue, currentValue) => previousValue + currentValue.contributionCount, 0)

      return {
        ...month,
        contributionsCount: getContributionsByMonth,
      }
    }) ?? []

  const contributionColors = data?.colors ?? []

  useLayoutEffect(() => {
    scrollToNewestWeek(scrollRef.current)
  }, [weeks.length])

  return (
    <>
      <div
        ref={scrollRef}
        tabIndex={0}
        aria-label="GitHub contribution calendar"
        className="w-full min-w-0 overflow-x-auto overscroll-x-contain pb-1"
      >
        <div className="flex w-max min-w-full flex-col">
          <ul className="flex gap-[3px] text-xs text-muted-foreground">
            {months.map((month) => (
              <li
                key={month.firstDay}
                className={cn(month.totalWeeks < 2 && "invisible")}
                style={{ minWidth: WEEK_COLUMN_PX * month.totalWeeks }}
              >
                {month.name}
              </li>
            ))}
          </ul>

          <div className="flex gap-[3px] py-0.5">
            {weeks.map((week) => (
              <div key={week.firstDay} className="flex w-[12px] shrink-0 flex-col">
                {week.contributionDays.map((contribution) => {
                  const backgroundColor = contribution.contributionCount > 0 && contribution.color

                  return (
                    <span
                      key={contribution.date}
                      className="my-[2px] block h-[12px] w-[12px] rounded-sm bg-muted transition-transform duration-150 hover:scale-125"
                      style={backgroundColor ? { backgroundColor } : undefined}
                      onMouseEnter={() =>
                        setSelectContribution({
                          count: contribution.contributionCount,
                          date: contribution.date,
                        })
                      }
                      onMouseLeave={() => setSelectContribution({ count: null, date: null })}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Less</span>
          <ul className="flex gap-1">
            <li className="h-[10px] w-[10px] rounded-sm bg-muted" />
            {contributionColors.map((item) => (
              <li key={item} className="h-[10px] w-[10px] rounded-sm" style={{ backgroundColor: item }} />
            ))}
          </ul>
          <span>More</span>
        </div>

        <div
          className={cn(
            selectContribution?.date ? "opacity-100" : "opacity-0",
            "rounded-md bg-muted px-2 text-sm transition-opacity duration-200",
          )}
        >
          {selectContribution?.count} contributions on {selectContribution?.date}
        </div>
      </div>
    </>
  )
}

export default GithubCalendar
