import ftxPairDict from '../pair_dictionaries/ftx.json';
import { FormattedQuote, Exchange } from '..';
import { usdPriceIndex } from '../../globals';
import { RawData, WebSocket } from 'ws';

export default class FTX extends Exchange {
  /*

  */

  constructor() {
    super();
    this.pairDict = ftxPairDict;
  }

  getPairDict() {}

  subscribe(store: Boolean): void {
    const ws = new WebSocket('wss://ftx.com/ws');
    ws.on('open', () => {
      const subscriptionArr = Object.keys(ftxPairDict).map(
        // Creates a subscription message for each pair
        (key) => {
          return {
            op: 'subscribe',
            channel: 'ticker',
            market: ftxPairDict[key].join('/'),
          };
        }
      );
      subscriptionArr.forEach((message) => {
        console.log(message);
        // Subscribes to each pair
        ws.send(Buffer.from(JSON.stringify(message)));
      });
      console.log('FTX connected');
      ws.on('message', (rawData: RawData) => {
        this.process(rawData, store);
      });
      ws.on('close', this.subscribe);
    });
  }

  process(rawData: RawData, store: Boolean): FormattedQuote[] | null {
    let quote = JSON.parse(rawData.toString());
    if (quote.type != 'update') return null;
    console.log(quote);
    const pair = quote.market.split('/');
    const rate = quote.data?.last;

    const formattedData = <FormattedQuote[]>[
      {
        exchange: 'FTX',
        pair: pair,
        rate: rate,
        usdPrice: usdPriceIndex[pair[1]] * rate,
        volume: quote.quoteVolume24h,
        timestamp: quote.data.time,
      },
    ];
    if (store) this.store(formattedData);
    return formattedData;
  }
}
