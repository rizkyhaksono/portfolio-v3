import type {
  CryptoPriceApiResponse,
  CryptoPrice,
  CryptoChartResponse,
  TrendingCryptoResponse,
  GasPriceResponse,
  GasPrice,
} from "@/commons/types/tools";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const COIN_INFO: Record<string, { name: string; symbol: string; image: string }> = {
  bitcoin: {
    name: "Bitcoin",
    symbol: "BTC",
    image: "https://coin-images.coingecko.com/coins/images/1/standard/bitcoin.png",
  },
  ethereum: {
    name: "Ethereum",
    symbol: "ETH",
    image: "https://coin-images.coingecko.com/coins/images/279/standard/ethereum.png",
  },
  binancecoin: {
    name: "BNB",
    symbol: "BNB",
    image: "https://coin-images.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png",
  },
  cardano: {
    name: "Cardano",
    symbol: "ADA",
    image: "https://coin-images.coingecko.com/coins/images/975/standard/cardano.png",
  },
  solana: {
    name: "Solana",
    symbol: "SOL",
    image: "https://coin-images.coingecko.com/coins/images/4128/standard/solana.png",
  },
  polkadot: {
    name: "Polkadot",
    symbol: "DOT",
    image: "https://coin-images.coingecko.com/coins/images/12171/standard/polkadot.png",
  },
};

export async function getCryptoPrice(coins: string = "bitcoin,ethereum"): Promise<{ status: number; message: string; data: CryptoPrice[] }> {
  const response = await fetch(`${API_URL}/v3/web3/web3/crypto/price?coins=${encodeURIComponent(coins)}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch crypto prices");

  const rawResponse: CryptoPriceApiResponse = await response.json();

  const transformedData: CryptoPrice[] = Object.entries(rawResponse.data).map(([coinId, priceData]) => {
    const coinInfo = COIN_INFO[coinId] || {
      name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
      symbol: coinId.substring(0, 3).toUpperCase(),
      image: "",
    };

    return {
      id: coinId,
      symbol: coinInfo.symbol,
      name: coinInfo.name,
      current_price: priceData.usd,
      price_change_percentage_24h: priceData.usd_24h_change,
      market_cap: priceData.usd_market_cap,
      image: coinInfo.image,
    };
  });

  transformedData.sort((a, b) => b.market_cap - a.market_cap);

  return {
    status: rawResponse.status,
    message: rawResponse.message,
    data: transformedData,
  };
}

export async function getCryptoChart(coin: string, days: number = 7): Promise<CryptoChartResponse> {
  const response = await fetch(`${API_URL}/v3/web3/web3/crypto/${coin}/chart?days=${days}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch crypto chart data");
  return await response.json();
}

export interface TransformedTrendingItem {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  price_btc: number;
  price_usd: number;
  price_change_24h: number;
  market_cap: string;
  sparkline: string;
}

export async function getTrendingCrypto(): Promise<{ status: number; message: string; data: TransformedTrendingItem[] }> {
  const response = await fetch(`${API_URL}/v3/web3/web3/crypto/trending`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch trending cryptocurrencies");

  const rawResponse: TrendingCryptoResponse = await response.json();

  const transformedData: TransformedTrendingItem[] = rawResponse.data.map((apiItem) => {
    const item = apiItem.item;
    return {
      id: item.id,
      name: item.name,
      symbol: item.symbol,
      market_cap_rank: item.market_cap_rank,
      thumb: item.thumb,
      price_btc: item.price_btc,
      price_usd: item.data?.price || 0,
      price_change_24h: item.data?.price_change_percentage_24h?.usd || 0,
      market_cap: item.data?.market_cap || "N/A",
      sparkline: item.data?.sparkline || "",
    };
  });

  return {
    status: rawResponse.status,
    message: rawResponse.message,
    data: transformedData,
  };
}

export async function getGasPrice(network: string = "ethereum"): Promise<{ status: number; message: string; data: GasPrice }> {
  const response = await fetch(`${API_URL}/v3/web3/web3/gas?network=${encodeURIComponent(network)}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch gas prices");

  const rawResponse: GasPriceResponse = await response.json();

  const gasData = rawResponse.data.gasPrice;
  const transformedData: GasPrice = {
    network: rawResponse.data.network,
    slow: Number.parseFloat(gasData.SafeGasPrice),
    standard: Number.parseFloat(gasData.ProposeGasPrice),
    fast: Number.parseFloat(gasData.FastGasPrice),
    baseFee: Number.parseFloat(gasData.suggestBaseFee),
    lastBlock: gasData.LastBlock,
    unit: "Gwei",
  };

  return {
    status: rawResponse.status,
    message: rawResponse.message,
    data: transformedData,
  };
}
