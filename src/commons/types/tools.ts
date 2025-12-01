// Japanese Quiz Types
export interface JLPTLevel {
  code: string;
  name: string;
  description: string;
}

export interface JLPTLevelsResponse {
  success: boolean;
  levels: JLPTLevel[];
}

export interface JLPTWord {
  word: string;
  reading: string;
  meaning: string;
  level: string;
  partOfSpeech: string;
}

export interface JLPTVocabularyResponse {
  success: boolean;
  level: string;
  count: number;
  words: JLPTWord[];
}

export interface JLPTQuestion {
  id: number;
  word: string;
  reading: string;
  options: string[];
  correct: string;
  level: string;
}

export interface JLPTQuizResponse {
  success: boolean;
  level: string;
  count: number;
  questions: JLPTQuestion[];
}

export interface JLPTVerifyRequest {
  questionId: number;
  answer: string;
  correct: string;
}

export interface JLPTVerifyResponse {
  success: boolean;
  questionId: number;
  isCorrect: boolean;
  message: string;
}

export interface JLPTRandomWordResponse {
  success: boolean;
  word: JLPTWord;
}

// Anime Types
export interface AnimeImageResponse {
  url: string;
}

// Downloader Types
export interface DownloadResult {
  title: string;
  thumbnail: string;
  downloadLinks: {
    quality: string;
    url: string;
    size?: string;
  }[];
  author?: string;
  duration?: string;
}

export interface SocialMediaDownloadResult {
  status: number;
  message: string;
  data: DownloadResult;
}

// Instagram specific response (when download service is unavailable)
export interface InstagramDownloadData {
  url: string;
  shortcode: string;
  embedUrl: string;
  directUrl: string;
  note?: string;
}

export interface InstagramDownloadResponse {
  success: boolean;
  data: InstagramDownloadData;
}

// Postal Code Types
export interface Province {
  code: string;
  name: string;
}

export interface ProvinceResponse {
  success: boolean;
  data: Province[];
  total: number;
}

export interface City {
  code: string;
  name: string;
}

export interface CityResponse {
  success: boolean;
  data: City[];
  total: number;
}

export interface District {
  code: string;
  name: string;
}

export interface DistrictResponse {
  success: boolean;
  data: District[];
  total: number;
}

export interface Village {
  code: string;
  name: string;
}

export interface VillageResponse {
  success: boolean;
  data: Village[];
  total: number;
}

export interface PostalCodeData {
  code: string;
  postal: number;
  slug: string;
  province: string;
  city: string;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
  elevation: number;
  geometry: boolean;
}

export interface PostalCodeSearchResponse {
  success: boolean;
  data: {
    count: number;
    limit: number;
    offset: number;
    data: PostalCodeData[];
  };
  total: number;
}


// Anime Quote Types
export interface AnimeQuote {
  content: string;
  anime: {
    id: number;
    name: string;
    altName: string;
  };
  character: {
    id: number;
    name: string;
  };
}

export interface AnimeQuoteResponse {
  status: string;
  data: AnimeQuote;
}


// Web3 Types
export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

// Raw API response format for crypto prices
export interface CryptoPriceRawData {
  usd: number;
  usd_market_cap: number;
  usd_24h_vol: number;
  usd_24h_change: number;
}

export interface CryptoPriceApiResponse {
  status: number;
  message: string;
  data: Record<string, CryptoPriceRawData>;
}

export interface CryptoPriceResponse {
  status: number;
  message: string;
  data: CryptoPrice[];
}

export interface ChartDataPoint {
  timestamp: number;
  price: number;
}

export interface CryptoChartResponse {
  status: number;
  message: string;
  data: {
    coin: string;
    prices: ChartDataPoint[];
  };
}

// Trending crypto types matching actual API response
export interface TrendingCryptoItem {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  small: string;
  large: string;
  slug: string;
  price_btc: number;
  score: number;
  data: {
    price: number;
    price_btc: string;
    price_change_percentage_24h: Record<string, number>;
    market_cap: string;
    market_cap_btc: string;
    total_volume: string;
    total_volume_btc: string;
    sparkline: string;
    content: {
      title: string;
      description: string;
    } | null;
  };
}

export interface TrendingCryptoApiItem {
  item: TrendingCryptoItem;
}

export interface TrendingCrypto {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  price_btc: number;
}

export interface TrendingCryptoResponse {
  status: number;
  message: string;
  data: TrendingCryptoApiItem[];
}

// Gas price types matching actual API response
export interface GasPriceApiData {
  network: string;
  gasPrice: {
    LastBlock: string;
    SafeGasPrice: string;
    ProposeGasPrice: string;
    FastGasPrice: string;
    suggestBaseFee: string;
    gasUsedRatio: string;
  };
}

export interface GasPrice {
  network: string;
  slow: number;
  standard: number;
  fast: number;
  baseFee: number;
  lastBlock: string;
  unit: string;
}

export interface GasPriceResponse {
  status: number;
  message: string;
  data: GasPriceApiData;
}

// Tools Tab Types
export type ToolTab =
  | "japanese-quiz"
  | "anime-generator"
  | "downloader"
  | "wpm"
  | "files"
  | "compiler"
  | "postal-code"
  | "web3-crypto";

export interface ToolCategory {
  id: ToolTab;
  name: string;
  description: string;
  icon: string;
}

