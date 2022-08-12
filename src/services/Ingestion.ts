import Binance from '../exchanges/binance';
import FTX from '../exchanges/ftx';
import HitBTC from '../exchanges/hitbtc';
import Kucoin from '../exchanges/kucoin';
import Kraken from '../exchanges/kraken';
import * as exchanges from '../exchanges';
import fs from 'fs/promises';
import path from 'path';
//import { Binance, FTX, HitBTC } from '../exchanges';

export default async function start() {
  console.log(Object.keys(exchanges))
  Object.keys(exchanges).forEach((exchangeKey) => {
    console.log(`Creating instance of ${exchangeKey} client`)
    const client = new (exchanges[exchangeKey]).default();
    client.subscribe({
      quotes: true,
      candles: true,
      store: true,
    });
  })
}
