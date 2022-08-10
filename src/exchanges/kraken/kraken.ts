import krakenPairDict from '../pair_dictionaries/kraken.json';
import krakenPairDictWS from '../pair_dictionaries/kraken_WS.json';
import { FormattedQuote, Exchange } from '..';
import { usdPriceIndex } from '../../globals';
import { RawData, WebSocket } from 'ws';
import axios from 'axios';

export default class Kraken extends Exchange {
  /*

  */

  constructor() {
    super();
  }

  // Kraken follows different ticker protocols (ISO 4217-A3) for their WebSocket and REST API: https://support.kraken.com/hc/en-us/articles/360022326871-Kraken-WebSocket-API-Frequently-Asked-Questions#9
  async getPairDictWS() {
    const pairs = (
      await axios.get('https://api.kraken.com/0/public/AssetPairs')
    ).data.result;
    let pairDict = {};
    Object.keys(pairs).forEach((pair) => {
      console.log(pairs[pair]);
      pairDict[pair] = pairs[pair].wsname.split('/');
    });
    console.log(pairDict);
    return pairDict;
  }

  async getPairDict() {
    const pairs = (
      await axios.get('https://api.kraken.com/0/public/AssetPairs')
    ).data.result;
    console.log(pairs);
    let pairDict = {};
    Object.keys(pairs).forEach((pair) => {
      pairDict[pair] = [pairs[pair].base, pairs[pair].quote];
    });
    return pairDict;
  }

  async subscribe(store: Boolean): Promise<void> {
    const ws = new WebSocket('wss://ws.kraken.com');
    ws.on('open', () => {
      let pairs = Object.keys(krakenPairDictWS).map(
        (key) => `${krakenPairDictWS[key][0]}/${krakenPairDictWS[key][1]}`
      );
      ws.send(
        JSON.stringify({
          event: 'subscribe',
          pair: pairs,
          subscription: {
            name: 'ticker',
          },
        })
      );
      console.log('Kraken connected');
      ws.on('message', (rawData: RawData) => {
        const message = JSON.parse(rawData.toString());
        console.log(message);
        this.process(rawData, store);
      });
      ws.on('close', () => console.log('socket closed'));
    });
  }

  process(rawData: RawData, store: Boolean): FormattedQuote[] | null {
    const quote = JSON.parse(rawData.toString()).data?.data;
    if (!quote) return null;
    const pair = [quote.baseCurrency, quote.quoteCurrency];
    const rate = quote.lastTradedPrice;
    const usdPrice = usdPriceIndex[pair[1]] * rate;
    const newQuote = <FormattedQuote[]>[
      {
        exchange: 'Kraken',
        pair: pair,
        rate: rate,
        usdPrice: usdPrice,
        volume: quote.vol * usdPrice,
        timestamp: quote.datetime,
      },
    ];
    console.log(newQuote);
    return null;
  }
}
