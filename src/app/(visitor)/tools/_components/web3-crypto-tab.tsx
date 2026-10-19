"use client"

import { useCallback, useState } from "react"
import { InkChart } from "@/components/ui/ink-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCryptoChart, getCryptoPrice, getTrendingCrypto } from "@/services/visitor/web3"
import { ToolError, ToolLoading, useToolData } from "./tool-status"

const COINS = "bitcoin,ethereum,binancecoin,cardano,solana,polkadot"
const loadPrices = () => getCryptoPrice(COINS).then((res) => res.data)
const loadTrending = () => getTrendingCrypto().then((res) => res.data.slice(0, 10))

const usd = (value: number, compact = false) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    minimumFractionDigits: compact ? 0 : 2,
    maximumFractionDigits: compact ? 1 : value < 1 ? 6 : 2,
  }).format(value)

/** Direction as a word, never as a colour. */
function Change({ value }: Readonly<{ value: number }>) {
  if (!Number.isFinite(value)) return <span className="text-ink-soft">Not reported</span>
  return (
    <>
      {value >= 0 ? "Up" : "Down"} {Math.abs(value).toFixed(2)}%
    </>
  )
}

export function Web3CryptoTab() {
  return (
    <Tabs defaultValue="prices" className="w-full">
      <TabsList>
        <TabsTrigger value="prices">Prices</TabsTrigger>
        <TabsTrigger value="trending">Trending</TabsTrigger>
        <TabsTrigger value="chart">Chart</TabsTrigger>
      </TabsList>
      <TabsContent value="prices">
        <Prices />
      </TabsContent>
      <TabsContent value="trending">
        <Trending />
      </TabsContent>
      <TabsContent value="chart">
        <Chart />
      </TabsContent>
    </Tabs>
  )
}

function Prices() {
  const prices = useToolData(loadPrices)
  if (prices.status === "error") return <ToolError onRetry={prices.retry}>Prices did not load.</ToolError>
  if (prices.status === "loading" || !prices.data) return <ToolLoading>Loading prices…</ToolLoading>

  return (
    <Table>
      <TableCaption>In US dollars. Change is over the last 24 hours.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Coin</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">24 hours</TableHead>
          <TableHead className="hidden text-right sm:table-cell">Market cap</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prices.data.map((coin) => (
          <TableRow key={coin.id}>
            <TableCell>
              <span className="font-semibold text-ink">{coin.name}</span> <span className="text-ink-soft">{coin.symbol}</span>
            </TableCell>
            <TableCell className="text-right">{usd(coin.current_price)}</TableCell>
            <TableCell className="text-right">
              <Change value={coin.price_change_percentage_24h} />
            </TableCell>
            <TableCell className="hidden text-right sm:table-cell">{usd(coin.market_cap, true)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function Trending() {
  const trending = useToolData(loadTrending)
  if (trending.status === "error") return <ToolError onRetry={trending.retry}>Trending coins did not load.</ToolError>
  if (trending.status === "loading" || !trending.data) return <ToolLoading>Loading trending coins…</ToolLoading>

  return (
    <Table>
      <TableCaption>The coins people are searching for most right now, in order.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Coin</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">24 hours</TableHead>
          <TableHead className="hidden text-right sm:table-cell">Market cap rank</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trending.data.map((coin) => (
          <TableRow key={coin.id}>
            <TableCell>
              <span className="font-semibold text-ink">{coin.name}</span> <span className="text-ink-soft">{coin.symbol}</span>
            </TableCell>
            <TableCell className="text-right">{coin.price_usd > 0 ? usd(coin.price_usd) : <span className="text-ink-soft">Not reported</span>}</TableCell>
            <TableCell className="text-right">
              {coin.price_usd > 0 ? <Change value={coin.price_change_24h} /> : <span className="text-ink-soft">Not reported</span>}
            </TableCell>
            <TableCell className="hidden text-right sm:table-cell">{coin.market_cap_rank ?? "Unranked"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const CHART_COINS = [
  ["bitcoin", "Bitcoin"],
  ["ethereum", "Ethereum"],
  ["solana", "Solana"],
] as const
const RANGES = [7, 30, 90] as const

type Point = { x: string; y: number }

// The API sends [timestamp, price] pairs; older builds sent { timestamp, price } objects.
const toPoints = (prices: unknown[]): Point[] =>
  prices
    .map((p) => (Array.isArray(p) ? { t: Number(p[0]), y: Number(p[1]) } : { t: Number((p as { timestamp: number }).timestamp), y: Number((p as { price: number }).price) }))
    .filter((p) => Number.isFinite(p.t) && Number.isFinite(p.y))
    .map((p) => ({ x: new Date(p.t).toISOString().slice(0, 16).replace("T", " "), y: p.y }))

const day = (x: string) => new Date(`${x.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "UTC" })

/** Price history as one ink line: pick a coin and a window; the sentence underneath says what happened. */
function Chart() {
  const [coin, setCoin] = useState<(typeof CHART_COINS)[number][0]>("bitcoin")
  const [days, setDays] = useState<(typeof RANGES)[number]>(30)
  const load = useCallback(() => getCryptoChart(coin, days).then((res) => toPoints(res.data.prices as unknown[])), [coin, days])
  const chart = useToolData(load)
  const name = CHART_COINS.find(([id]) => id === coin)?.[1] ?? coin

  const points = chart.data ?? []
  const first = points[0]
  const last = points.at(-1)
  const high = points.reduce<Point | undefined>((a, p) => (!a || p.y > a.y ? p : a), undefined)
  const low = points.reduce<Point | undefined>((a, p) => (!a || p.y < a.y ? p : a), undefined)
  const change = first && last ? ((last.y - first.y) / first.y) * 100 : NaN

  const choice = (active: boolean) =>
    `min-h-10 border px-3 text-small [@media(pointer:coarse)]:min-h-11 ${active ? "border-ink bg-ink text-paper" : "border-rule-strong text-ink hover:border-ink"}`

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div role="group" aria-label="Coin" className="flex flex-wrap gap-2">
          {CHART_COINS.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={coin === id} className={choice(coin === id)} onClick={() => setCoin(id)} data-umami-event="tool-chart" data-umami-event-coin={id}>
              {label}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Period" className="flex gap-2">
          {RANGES.map((d) => (
            <button key={d} type="button" aria-pressed={days === d} className={choice(days === d)} onClick={() => setDays(d)}>
              {d} days
            </button>
          ))}
        </div>
      </div>

      {chart.status === "error" ? (
        <ToolError onRetry={chart.retry}>The price history did not load.</ToolError>
      ) : points.length < 2 ? (
        <ToolLoading>Loading the price history…</ToolLoading>
      ) : (
        <>
          <p className="max-w-[60ch] text-body text-ink">
            {name} is {change >= 0 ? "up" : "down"} {Math.abs(change).toFixed(1)}% over the last {days} days, from {usd(first!.y)} to {usd(last!.y)}.
            {high && low && ` Its high was ${usd(high.y)} on ${day(high.x)}; its low was ${usd(low.y)} on ${day(low.x)}.`}
          </p>
          <InkChart
            points={points}
            name="Price"
            label={`${name} price in US dollars, last ${days} days`}
            fromZero={false}
            formatY={(y) => usd(y, y >= 10_000)}
            height={220}
            className={chart.status === "loading" ? "opacity-60" : undefined}
          />
          <p className="font-display text-caption text-ink-soft">In US dollars, from CoinGecko through this site's API. Not financial advice.</p>
        </>
      )}
    </div>
  )
}
