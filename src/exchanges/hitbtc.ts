import hitbtcPairDict from './pair_dictionaries/hitbtc.json';
import { FormattedData, ExchangeTemplate } from './_exchange';
import { usdPriceIndex } from '../globals';

const HitBTC: ExchangeTemplate = {
  /*

  */

  NAME: 'HitBTC',
  WS_URI: 'wss://api.hitbtc.com/api/3/ws/public',
  PAIR_DICT: hitbtcPairDict,
  SUBSCRIBE_MESSAGES: [
    {
      method: 'subscribe',
      ch: 'ticker/price/1s',
      params: {
        symbols: ['ETHBTC', 'BTCUSDT'],
      },
      id: 0,
    },
  ],
  WS_PROCESSOR: (rawData: any): FormattedData[] | null => {
    const quote = JSON.parse(rawData.toString());
    console.log(quote);
    return null;
    /*
    const formattedData = <FormattedData[]>[
      {
        exchange: 'FTX',
        pair: pair,
        rate: rate,
        usdPrice: usdPriceIndex[pair[1]] * rate,
        volume: quote.quoteVolume24h,
        timestamp: quote.data.time,
      },
    ];
    return formattedData;*/
  },
};

export default HitBTC;
