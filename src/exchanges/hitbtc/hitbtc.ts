import hitbtcPairDict from '../pair_dictionaries/hitbtc.json';
import {FormattedQuote}, Exchange } from './_exchange';
import { usdPriceIndex } from '../../globals';
import { RawData, WebSocket } from 'ws';

export default class HitBTC extends Exchange {
  /*

  */

  constructor() {
    super();
    this.pairDict = hitbtcPairDict;
  }

  async getPairDict() {
    return;
  }

  subscribe(store: Boolean): void {
    const ws = new WebSocket('wss://api.demo.hitbtc.com/api/3/ws/public');
    ws.on('open', () => {
      let symbolList = Object.keys(hitbtcPairDict);
      while (symbolList.length > 0) {
        const symbols = symbolList.splice(0, 4);
        console.log(symbols);
        ws.send(
          JSON.stringify({
            method: 'subscribe',
            ch: 'ticker/1s/batch', // Channel
            params: {
              symbols: symbols,
            },
            id: 0,
          })
        );
      }
      console.log('HitBTC connected');
      ws.on('message', (rawData: RawData) => {
        console.log(JSON.parse(rawData.toString()));
        this.process(rawData, store);
      });
      ws.on('close', this.subscribe);
    });
  }

  process(rawData: RawData, store: Boolean): FormattedQuote[] | null {
    let quote = JSON.parse(rawData.toString());
    return null;
  }
}
