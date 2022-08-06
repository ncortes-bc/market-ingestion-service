import { FormattedData, ExchangeTemplate } from './_exchange';
import { usdPriceIndex } from '../globals';
import axios from 'axios';
import { isInterfaceDeclaration } from 'typescript';

let Kucoin: ExchangeTemplate;

async function getURI() {
  const response = await axios.get(
    'https://openapi-v2.kucoin.com/api/v1/bullet-public'
  );

  console.log('test');
  console.log(response);
  return 'ws://kucoin.com';
}

function init() {
  Kucoin = {
    NAME: 'Kucoin',
    WS_URI: await getURI(),
    WS_PROCESSOR: (rawData: any): FormattedData[] | null => {
      const quote = JSON.parse(rawData.toString());
      console.log(quote);
      return null;
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
}

init();
export default Kucoin;
