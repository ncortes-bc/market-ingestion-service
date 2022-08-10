import pairDict from './pairDict.json';
import { FormattedQuote, FormattedCandle, Exchange } from '..';
import { usdPriceIndex, stableCoins } from '../../globals';
import { RawData, WebSocket } from 'ws';
import axios from 'axios';

// quotes, assets, exchanges, charts //assets and quotes contain duplicate data, but this allows for calculation of
// average price, while also allowing for queries performed directly on the quotes

export default class Binance extends Exchange {
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

  constructor() {
    super();
  }

  async genPairDict() {
    //INCOMPLETE
    const response = await axios.get(
      'https://api.binance.com/api/v3/exchangeInfo'
    );
  }

  async subscribe(options: {
    quotes?: Boolean;
    candles?: Boolean;
    historicalCandles?: Boolean;
    store?: Boolean;
  }): Promise<void> {
    const intervals = ['1m', '5m', '30m', '1h', '4h', '1d', '1w']; // Referneced in historicalCandles and candles

    if (!options)
      console.log('WARNING: No options supplied to Binance subscription');

    if (options.quotes) {
      const ws = new WebSocket(
        'wss://stream.binance.com:9443/ws/!miniTicker@arr'
      );
      ws.on('open', () => {
        console.log('Subscribed to Binance quotes');
        ws.on('message', (rawData: RawData) => {
          const formattedQuotes = this.processQuotes(rawData);
          if (options.store && formattedQuotes)
            this.storeQuotes(formattedQuotes);
        });
        ws.on('close', this.subscribe);
      });
    }

    if (options.candles) {
      const ws = new WebSocket('wss://stream.binance.com:9443/ws');
      ws.on('open', () => {
        const candlePairs = Object.keys(pairDict)
          .filter((symbol) => stableCoins.includes(pairDict[symbol][1])) // Filter for charts against stable coins
          .map((symbol) => `${symbol.toLowerCase()}@kline_1m`); // Prepares the arrray for use as params in the subscription message
        ws.on('message', (rawData) => {
          console.log(JSON.parse(rawData.toString()));
        });
        // Sends subcsription message
        ws.send(
          JSON.stringify({
            method: 'SUBSCRIBE',
            params: candlePairs, // *CAUTION* Max number of subscriptions is 443; 407 subscriptions as of 08/10/2022
            id: 0,
          })
        );
        console.log('Subscribed to Binance live candles');
        ws.on('close', () => {});
      });
    }

    if (options.historicalCandles) {
      console.log('Subscribed to Binance historical candles');
      const symbols = Object.keys(pairDict);
      const scheduler = setInterval(async () => {
        // Rate limit for this endpoint = 20 requests per second. This scheduler sends 7 per second.
        if (symbols.length == 0) {
          clearInterval(scheduler);
          return;
        }
        const symbol = symbols.pop();
        intervals.forEach(async (interval) => {
          const rawCandles = (
            await axios.get(
              `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}`
            )
          ).data;
          const formattedCandles = this.processCandles({
            pair: pairDict[<string>symbol],
            interval: interval,
            rawCandles: rawCandles,
          });
          if (options.store && formattedCandles)
            this.storeCandles(formattedCandles);
        });
      }, 1000);
    }
  }

  processCandles(rawData: any): FormattedCandle[] | null {
    console.log(rawData);
    return null;
  }

  processQuotes(rawData: RawData): FormattedQuote[] | null {
    let quotes = JSON.parse(rawData.toString());
    const formattedData = quotes.map((quote) => {
      const pair = pairDict[quote.s];
      const rate = quote.h;

      // "if" ensures pair is defined in dictionary before returning a formatted quote
      if (pair)
        return <FormattedQuote>{
          exchange: 'Binance',
          pair: pair,
          rate: rate,
          usdPrice: usdPriceIndex[pair[1]] * rate,
          volume: quote.v,
          timestamp: quote.E,
        };
      return null;
    });
    return formattedData;
  }
}
