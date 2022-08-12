import * as mongodb from 'mongodb';
import * as dotenv from 'dotenv';
let price_history = {};

async function connectdb() {
  dotenv.config();
  const client = new mongodb.MongoClient(String(process.env.DB_CONN_STRING));
  await client.connect();
  const db = client.db(process.env.DB_NAME);
  price_history = db.collection('price_history');
  console.log('DB CONNECTED');
  return;
}

connectdb();

export { price_history };
