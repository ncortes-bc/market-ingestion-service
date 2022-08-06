import binancePairDict from './pair_dictionaries/binance.json';
import { FormattedData, ExchangeTemplate } from './_exchange';
import { usdPriceIndex } from '../globals';

// quotes, assets, exchanges, charts //assets and quotes contain duplicate data, but this allows for calculation of
// average price, while also allowing for queries performed directly on the quotes

export const Binance: ExchangeTemplate = {
  /*
    response
    [
        {
            "e": "24hrMiniTicker",  // Event type
            "E": 123456789,         // Event time
            "s": "BNBBTC",          // Symbol
            "c": "0.0025",          // Close price
            "o": "0.0010",          // Open price
            "h": "0.0025",          // High price
            "l": "0.0010",          // Low price
            "v": "10000",           // Total traded base asset volume
            "q": "18"               // Total traded quote asset volume
        },
        ...
    ]
  */

  NAME: 'Binance',
  WS_URI: 'wss://stream.binance.com:9443/ws/!miniTicker@arr',
  PAIR_DICT: binancePairDict,
  WS_PROCESSOR: (rawData: any): FormattedData[] => {
    rawData = JSON.parse(rawData.toString());
    const formattedData = rawData.map((quote) => {
      const pair = binancePairDict[quote.s];
      const rate = quote.h;

      return <FormattedData>{
        exchange: 'Binance',
        pair: pair,
        rate: rate,
        usdPrice: usdPriceIndex[pair[1]] * rate,
        volume: quote.v,
        timestamp: quote.E,
      };
    });
    return formattedData;
  },
};
