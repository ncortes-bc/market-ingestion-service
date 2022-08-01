import axios from 'axios';
import hitbtcPairDict from './pair_dictionaries/hitbtc.json';
import { exchange, pairDict, formattedQuote } from './_exchange';

export default class hitbtc implements exchange {
  pairDict: pairDict;

  constructor() {
    this.pairDict = hitbtcPairDict;
  }

  async genPairDict(): Promise<pairDict> {
    let pairDictionary = {};
    const symbols = (
      await axios.get('https://api.hitbtc.com/api/3/public/symbol')
    ).data;
    Object.keys(symbols).forEach((symbol) => {
      const baseCurrency = symbols[symbol].base_currency;
      const quoteCurrency = symbols[symbol].quote_currency;
      if (baseCurrency && quoteCurrency) {
        pairDictionary[symbol] = [baseCurrency, quoteCurrency];
      }
    });
    this.pairDict = pairDictionary;
    return this.pairDict;
  }

  async rawQuotes(): Promise<any> {
    return (await axios.get('https://api.hitbtc.com/api/3/public/ticker')).data;
  }

  async formattedQuotes(): Promise<formattedQuote[]> {
    const rawQuotes = await this.rawQuotes(); // hitbtc returns an object with pair symbols as keys for each quote
    // maps the rawQuotes keys to an array of formatted quotes
    return Object.keys(rawQuotes).map((symbol) => {
      const rawQuote = rawQuotes[symbol]; // grabs the rawQuote associated with the pair key

      const pair = this.pairDict[symbol]; // Uses pair dictionary to derive the pair array
      const rate = Number(rawQuote.last);
      const usdPrice = rate; // *NOTE* change to getUsdPrice(pair[1], rate);

      return <formattedQuote>{
        exchange: 'Kucoin',
        pair: pair,
        rate: rate,
        usdPrice: usdPrice,
        volume: Number(rawQuote.volume),
        timestamp: rawQuote.timestamp,
      };
    });
  }
}
