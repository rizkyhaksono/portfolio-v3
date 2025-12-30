"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Zap, Loader2 } from "lucide-react"

export function Web3CryptoTab() {
  const [prices, setPrices] = useState<any[]>([])
  const [trending, setTrending] = useState<any[]>([])
  const [gasPrice, setGasPrice] = useState<any>(null)
  const [loading, setLoading] = useState({ prices: true, trending: true, gas: true })

  useEffect(() => {
    fetchCryptoPrices()
    fetchTrending()
    fetchGasPrice()
  }, [])

  const fetchCryptoPrices = async () => {
    try {
      const { getCryptoPrice } = await import("@/services/visitor/web3")
      const response = await getCryptoPrice("bitcoin,ethereum,binancecoin,cardano,solana,polkadot")
      setPrices(response.data || [])
    } catch (error) {
      console.error("Failed to fetch crypto prices:", error)
    } finally {
      setLoading((prev) => ({ ...prev, prices: false }))
    }
  }

  const fetchTrending = async () => {
    try {
      const { getTrendingCrypto } = await import("@/services/visitor/web3")
      const response = await getTrendingCrypto()
      setTrending(response.data || [])
    } catch (error) {
      console.error("Failed to fetch trending:", error)
    } finally {
      setLoading((prev) => ({ ...prev, trending: false }))
    }
  }

  const fetchGasPrice = async () => {
    try {
      const { getGasPrice } = await import("@/services/visitor/web3")
      const response = await getGasPrice("ethereum")
      setGasPrice(response.data)
    } catch (error) {
      console.error("Failed to fetch gas price:", error)
    } finally {
      setLoading((prev) => ({ ...prev, gas: false }))
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price)
  }

  const formatPercent = (percent: number) => {
    const formatted = percent.toFixed(2)
    return `${percent >= 0 ? "+" : ""}${formatted}%`
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="prices" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prices">Prices</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="gas">Gas Prices</TabsTrigger>
        </TabsList>

        <TabsContent value="prices" className="space-y-4">
          {loading.prices ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prices.map((crypto) => (
                <Card key={crypto.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {crypto.image && <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />}
                        <div>
                          <h3 className="font-semibold">{crypto.name}</h3>
                          <p className="text-xs text-muted-foreground uppercase">{crypto.symbol}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">{formatPrice(crypto.current_price)}</p>
                      <div className="flex items-center gap-2">
                        {crypto.price_change_percentage_24h >= 0 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                        <span className={`text-sm font-medium ${crypto.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}>{formatPercent(crypto.price_change_percentage_24h)}</span>
                        <span className="text-xs text-muted-foreground">24h</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Market Cap: {formatPrice(crypto.market_cap)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          {loading.trending ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {trending.slice(0, 10).map((crypto, index) => (
                    <div key={crypto.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        {crypto.thumb && <img src={crypto.thumb} alt={crypto.name} className="w-6 h-6 rounded-full" />}
                        <div>
                          <p className="font-medium">{crypto.name}</p>
                          <p className="text-xs text-muted-foreground uppercase">{crypto.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        {crypto.price_usd > 0 && (
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatPrice(crypto.price_usd)}</p>
                            <div className="flex items-center justify-end gap-1">
                              {crypto.price_change_24h >= 0 ? <TrendingUp className="w-3 h-3 text-green-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
                              <span className={`text-xs ${crypto.price_change_24h >= 0 ? "text-green-500" : "text-red-500"}`}>{formatPercent(crypto.price_change_24h)}</span>
                            </div>
                          </div>
                        )}
                        <Badge variant="secondary">Rank #{crypto.market_cap_rank}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="gas" className="space-y-4">
          <GasPricesContent loading={loading.gas} gasPrice={gasPrice} />

          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">
                  <strong>Note:</strong> Gas prices are displayed in Gwei for Ethereum network.
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>Slow:</strong> Lower cost, longer confirmation time(~10 mins)
                  </li>
                  <li>
                    <strong>Standard:</strong> Average cost, moderate confirmation time (~3 mins)
                  </li>
                  <li>
                    <strong>Fast:</strong> Higher cost, quick confirmation time (~30 secs)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

type GasPriceContentProps = Readonly<{
  loading: boolean
  gasPrice: { slow: number; standard: number; fast: number; unit: string } | null
}>

function GasPricesContent({ loading, gasPrice }: GasPriceContentProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!gasPrice) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">Slow</p>
            <Zap className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{gasPrice.slow}</p>
          <p className="text-xs text-muted-foreground mt-1">{gasPrice.unit}</p>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Standard</p>
            <Zap className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{gasPrice.standard}</p>
          <p className="text-xs text-muted-foreground mt-1">{gasPrice.unit}</p>
        </CardContent>
      </Card>

      <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Fast</p>
            <Zap className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{gasPrice.fast}</p>
          <p className="text-xs text-muted-foreground mt-1">{gasPrice.unit}</p>
        </CardContent>
      </Card>
    </div>
  )
}
