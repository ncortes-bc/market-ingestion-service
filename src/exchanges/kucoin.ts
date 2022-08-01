import axios from 'axios';
import { exchange, pairDict, formattedQuote } from './_exchange';

export default class kucoin implements exchange {
  constructor() {}

  async rawQuotes(): Promise<any> {
    return (await axios.get('https://api.kucoin.com/api/v1/market/allTickers'))
      .data.data.ticker;
  }

  async formattedQuotes(): Promise<formattedQuote[]> {
    const rawQuotes = await this.rawQuotes();
    const timestamp = Date.now();

    return rawQuotes.map((rawQuote) => {
      const pair = rawQuote.symbol.split('-');
      const rate = Number(rawQuote.last);
      const usdPrice = rate;

      return {
        exchange: 'Kucoin',
        pair: pair,
        rate: rate,
        usdPrice: usdPrice,
        volume: Number(rawQuote.vol),
        timestamp: timestamp,
      };
    });
  }
}
