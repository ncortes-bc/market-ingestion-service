import axios from 'axios';
import { exchange, pairDict, formattedQuote } from './_exchange';

export default class ftx implements exchange {
  constructor() {}

  async rawQuotes(): Promise<any> {
    return (await axios.get('https://ftx.com/api/markets')).data.result.filter(
      (quote) => quote.type == 'spot'
    );
  }

  async formattedQuotes(): Promise<formattedQuote[]> {
    const rawQuotes = await this.rawQuotes();
    const timestamp = Date.now(); // timestamp is calculated once

    return rawQuotes.map((rawQuote) => {
      const pair = [rawQuote.baseCurrency, rawQuote.quoteCurrency];
      const rate = Number(rawQuote.last);
      const usdPrice = rate;

      return <formattedQuote>{
        exchange: 'FTX',
        pair: pair,
        rate: rate,
        usdPrice: usdPrice,
        volume: Number(rawQuote.quoteVolume24h),
        timestamp: timestamp,
      };
    });
  }
}
