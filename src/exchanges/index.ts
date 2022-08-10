export interface FormattedCandle {}

export interface FormattedQuote {
  exchange: String; // Exchange name
  pair: Array<String>; // Assets in pair [base, quote]
  rate: Number; // Price of base asset in quote asset
  usdPrice: Number; // Price of base asset in USD
  volume: Number; // 24h volume in USD
  timestamp: Number; // Timestamp
}

export abstract class Exchange {
  constructor() {}

  // Starts ingestion of quotes and/or chart candles
  abstract subscribe(options?: {
    quotes?: Boolean; // Ingest quotes
    candles?: Boolean; // Ingest candlesticks
    historicalCandles?: Boolean; // Ingest hisotrical candlesticks (charts)
    store?: Boolean; // Store processed data in the db
  }): Promise<void>;

  abstract processQuotes(rawData: any): FormattedQuote[] | null; // Process rawData to produce FormatttedQuotes and FormattedCharts

  abstract processCandles(rawData: any): FormattedCandle[] | null;

  storeQuotes(formattedQuotes: FormattedQuote[]) {}

  storeCandles(formattedCandles: FormattedCandle[]) {}
}
