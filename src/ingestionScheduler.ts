import binance from './exchanges/binance';
import ftx from './exchanges/ftx';
import kucoin from './exchanges/kucoin';
import hitbtc from './exchanges/hitbtc';
import { pairDict } from './exchanges/_exchange';
import * as axios from 'axios';
import * as fs from 'fs/promises';

async function savePairDict(exchange: string, pairDict: pairDict) {
  await fs.writeFile(
    `./exchanges/pair_dictionaries/${exchange}.json`,
    JSON.stringify(pairDict)
  );
}

export default async function startSchedule() {
  const client = new kucoin();
  console.log(await client.formattedQuotes());
}
