/*
    [exchange0, ..., exchangeX] // a global array of all exisiting exchange instances 
*/

import { RawData, WebSocket } from 'ws';

export interface FormattedData {
  exchange: String;
  pair: Array<String>;
  rate: Number;
  usdPrice: Number;
  volume: Number;
  timestamp: Number;
}

export interface ExchangeTemplate {
  NAME: string;
  WS_URI: string;
  PAIR_DICT?: Object;
  SUBSCRIBE_MESSAGES?: Array<Object>;
  WS_PROCESSOR: Function;
}

export class Exchange {
  template: ExchangeTemplate;
  ws: WebSocket;

  constructor(template: ExchangeTemplate) {
    this.template = template;
  }

  connect() {
    this.ws = new WebSocket(this.template.WS_URI);
    this.ws.onopen = () => {
      console.log(`Exchange ${this.template.NAME} connected`);
      this.ws.send(
        Buffer.from(
          JSON.stringify({
            method: 'subscriptions',
            ch: 'trades', // Channel
            params: { symbols: ['ETHBTC', 'BTCUSDT'] },
            id: 123,
          })
        )
      );
    };
  }

  store(formattedData: FormattedData[]) {}

  process(data: any): FormattedData[] | null {
    return this.template.WS_PROCESSOR(data);
  }

  ingest(store: boolean): void {
    this.connect();
    this.ws.on('message', (rawData) => {
      console.log('message received');
      const formattedData = this.process(rawData);
      if (store && formattedData != null) {
        return this.store(formattedData);
      }
      return console.log(formattedData);
    });
    this.ws.on('close', () => {
      this.connect();
    });
  }
}

/*
    function stop() { //removes event listeners from websocket and closes it
        ws.removeEventListener();
    }

    function test() {
    // should ensure that formattedQuotes() is returning results in the expected format.
    }
}
*/
