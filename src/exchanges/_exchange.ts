export interface pairDict {
  [key: string]: string[];
}

interface formattedChart {}

export interface formattedQuote {
  exchange: string; // The name of the exchange that generated the quote
  pair: [string, string]; // An array containing the base asset ticker and quote asset ticker, in that order
  rate: number; // The rate of quote asset units per base asset unit
  usdPrice: number; // The USD-equivalent price of the base asset
  volume: number; // The USD-equivalent trading volume for this pair, on this exchange, over the last 24 hours
  timestamp: number; // Timestamp
}

export interface exchange {
  pairDict?: pairDict;

  genPairDict?(): Promise<pairDict>; // OPTIONAL - Some exchanges return concatenated tickers (eg. BTCUSD). A pair dictionary is used to match these symbols to an array explicitly defining the assets in the pair
  rawQuotes(): Promise<any>; // Fetches instant quotes from the exchange. Note - must return them as an array
  formattedQuotes(): Promise<formattedQuote[]>; // Takes in quotes as they are received by the exchange API, outputs an array of quotes formatted for the database
  //rawCharts(): Promise<any[]>;
  //formattedCharts(): Promise<formattedChart[]>;
}
