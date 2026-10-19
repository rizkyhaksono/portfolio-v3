"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCryptoPrice, getGasPrice, getTrendingCrypto } from "@/services/visitor/web3"
import { ToolError, ToolLoading, useToolData } from "./tool-status"

const COINS = "bitcoin,ethereum,binancecoin,cardano,solana,polkadot"
const loadPrices = () => getCryptoPrice(COINS).then((res) => res.data)
const loadTrending = () => getTrendingCrypto().then((res) => res.data.slice(0, 10))
const loadGas = () => getGasPrice("ethereum").then((res) => res.data)

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
        <TabsTrigger value="gas">Gas</TabsTrigger>
      </TabsList>
      <TabsContent value="prices">
        <Prices />
      </TabsContent>
      <TabsContent value="trending">
        <Trending />
      </TabsContent>
      <TabsContent value="gas">
        <Gas />
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

const gwei = (value: number) => (Number.isFinite(value) ? `${value.toLocaleString("en", { maximumFractionDigits: 2 })} Gwei` : "not reported")

function Gas() {
  const gas = useToolData(loadGas)
  if (gas.status === "error") return <ToolError onRetry={gas.retry}>Gas prices did not load.</ToolError>
  if (gas.status === "loading" || !gas.data) return <ToolLoading>Loading gas prices…</ToolLoading>

  const g = gas.data
  const tiers = [
    { label: "Slow", value: g.slow, note: "Cheapest. About ten minutes to confirm." },
    { label: "Standard", value: g.standard, note: "About three minutes to confirm." },
    { label: "Fast", value: g.fast, note: "Dearest. About thirty seconds to confirm." },
  ]
  const top = Math.max(1, ...tiers.map((t) => (Number.isFinite(t.value) ? t.value : 0)))
  const network = g.network ? g.network.charAt(0).toUpperCase() + g.network.slice(1) : "Ethereum"

  return (
    <div className="space-y-4">
      <p className="font-display text-caption tabular-nums text-ink-soft">
        {network}, block {g.lastBlock}. Base fee {gwei(g.baseFee)}.
      </p>
      <ul role="list" className="divide-y divide-rule border-y border-ink">
        {tiers.map((tier) => (
          <li key={tier.label} className="py-3">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-semibold text-ink">{tier.label}</span>
              <span className="font-display text-h3 tabular-nums text-ink">{gwei(tier.value)}</span>
            </div>
            <span aria-hidden className="mt-2 block h-3 border border-rule-strong">
              <span
                className="bg-hatch block h-full border-r border-ink"
                style={{ width: `${Number.isFinite(tier.value) ? (tier.value / top) * 100 : 0}%` }}
              />
            </span>
            <p className="mt-1 text-caption text-ink-soft">{tier.note}</p>
          </li>
        ))}
      </ul>
      <p className="font-display text-caption text-ink-soft">
        Gwei is a billionth of an ether. Confirmation times are typical, not promised.
      </p>
    </div>
  )
}
