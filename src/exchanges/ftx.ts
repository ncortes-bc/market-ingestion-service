import ftxPairDict from './pair_dictionaries/ftx.json';
import { FormattedData, ExchangeTemplate } from './_exchange';
import { usdPriceIndex } from '../globals';

export const FTX: ExchangeTemplate = {
  /*

  */

  NAME: 'FTX',
  WS_URI: 'wss://ftx.com/ws',
  PAIR_DICT: ftxPairDict,
  SUBSCRIBE_MESSAGES: Object.keys(ftxPairDict).map((key) => {
    return {
      op: 'subscribe',
      channel: 'ticker',
      market: ftxPairDict[key].join('/'),
    };
  }),
  WS_PROCESSOR: (rawData: any): FormattedData[] | null => {
    const quote = JSON.parse(rawData.toString());
    if (quote.type != 'update') return null;

    const pair = quote.market.split('/');
    const rate = quote.data?.last;

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
    return formattedData;
  },
};
