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

  // Starts ingestion of quotes and/or chart candles. Should call this.storeQuotes/this.storeCandles if store option is set to True
  abstract subscribe(options?: {
    quotes?: Boolean; // Ingest quotes
    candles?: Boolean; // Ingest candlesticks
    historicalCandles?: Boolean; // Ingest hisotrical candlesticks (charts)
    store?: Boolean; // Store processed data in the db
  }): Promise<void>;

  abstract process(type: string /*Tell the processing function what type of data it is dealing with*/, rawData: any): FormattedQuote[] | FormattedCandle[] | null; // Process rawData to produce FormattedQuotes and FormattedCandles

  store(formattedData: FormattedQuote[] | FormattedCandle[] | null) {
    //INCOMPLETE
    //if ( formattedData instanceof(FormattedQuote[]) ) {}
  }
}

