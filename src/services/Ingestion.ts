import Binance from '../exchanges/binance';
import FTX from '../exchanges/ftx';
import HitBTC from '../exchanges/hitbtc';
import Kucoin from '../exchanges/kucoin';
import Kraken from '../exchanges/kraken';
import fs from 'fs/promises';
import path from 'path';
//import { Binance, FTX, HitBTC } from '../exchanges';

export default async function start() {
  const binanceClient = new Binance();
  //binanceClient.genPairDict();
  binanceClient.subscribe({
    quotes: false,
    candles: true,
    store: false,
  });
  //const hitbtc = new Exchange(HitBTC);
  //hitbtc.ingest(false);
}
