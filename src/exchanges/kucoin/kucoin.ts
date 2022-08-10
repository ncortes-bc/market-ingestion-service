import { FormattedQuote, Exchange } from '..';
import { usdPriceIndex } from '../../globals';
import { RawData, WebSocket } from 'ws';
import axios from 'axios';

export default class Kucoin extends Exchange {
  /*

  */

  constructor() {
    super();
  }

  async getPairDict() {}

  async subscribe(store: Boolean): Promise<void> {
    const serverRes = (
      await axios.post('https://api.kucoin.com/api/v1/bullet-public')
    ).data.data;
    const ws = new WebSocket(
      `${serverRes.instanceServers[0].endpoint}?token=${serverRes.token}`
    );
    ws.on('open', () => {
      const markets = [
        'USDCS',
        'BTC',
        'KCS',
        'FIAT',
        'NFT',
        'ALTS',
        'Defi',
        'POLKADOT',
      ];
      markets.forEach((market) =>
        ws.send(
          JSON.stringify({
            id: 0,
            type: 'subscribe',
            topic: `/market/snapshot:${market}`,
            response: true,
          })
        )
      );
      console.log('Kucoin connected');
      ws.on('message', (rawData: RawData) => {
        this.process(rawData, store);
      });
      ws.on('close', this.subscribe);
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
        exchange: 'Kucoin',
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
