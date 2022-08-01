/*{
    name: 'Binance'
    rest_url: 'binance.com/api/...'
    ws_url: 'ws://binance.stream.com/ws/...'

    //this would do some kind of preproessing on the responses received from binance (optional)
    function preprocess() {

    }

    // this maps entries from raw binance responses to our database schema.
    template: {
        interval: 'i', // non-zero interval, interval of candlestick in milliseconds
        exchange: 'Binance',
        pair: ['q','f'], // [primary, secondary]
        datetime: 'c',
        open: 'o',
        high: 'h',
        low: 'l',
        close: 'c',
        volume: 'v',
    }
}

{
    ticker: string;
    price_usd: float;
    circ_supply: bigint;
    volume_24h: bigint;
    change_24h: float;
    percent_change_24h: float;
    max_supp: bigint;
    market_cap: bigint;
    exchange_pairs: [
        {
            exchange: string,
            pair: [string, string] ,
            price: float,
            volume_24h: bigint,
            time: bigint,
        },
    ];
    24h_price_history: [float]; //used for quick charting and determining 24h_percent_change
}*/

import axios from 'axios';
//import binancePairDict from './pair_dictionaries/binance.json';
import { exchange, pairDict, formattedQuote } from './_exchange';

export default class binance implements exchange {
  pairDict: pairDict;

  constructor() {
    this.pairDict = <pairDict>{};
  }

  async genPairDict(): Promise<pairDict> {
    let pairDictionary = {};

    const { symbols } = (
      await axios.get('https://binance.com/api/v3/exchangeInfo')
    ).data;
    symbols.forEach((symbol) => {
      pairDictionary[symbol.symbol] = [symbol.baseAsset, symbol.quoteAsset];
    });
    this.pairDict = pairDictionary;
    return pairDictionary;
  }

  async rawQuotes(): Promise<any> {
    return (await axios.get('https://binance.com/api/v3/ticker/24hr')).data;
  }

  async formattedQuotes(): Promise<formattedQuote[]> {
    const rawQuotes = await this.rawQuotes();
    const timestamp = Date.now(); // timestamp is calculated once

    return rawQuotes.map((rawQuote) => {
      const pair = this.pairDict[rawQuote.symbol];
      const rate = Number(rawQuote.lastPrice);
      const usdPrice = rate;

      return {
        exchange: 'Binance',
        pair: pair,
        rate: rate,
        usdPrice: usdPrice,
        volume: Number(rawQuote.quoteVolume),
        timestamp: timestamp,
      };
    });
  }
}
