const BASE_API = "https://min-api.cryptocompare.com/data";

const API_KEY = process.env.API_KEY;

export async function current(name = "BTC", currency = "USD") {
  const rps = await fetch(`${BASE_API}/price?fsym=${name}&tsyms=${currency}`);
  const data = await rps.json();
  return data[currency];
}

export async function historical(date, coin = "BTC", currency = "USD") {
  const TS = ~~(new Date(date).valueOf() / 1000);
  const rps = await fetch(
    `${BASE_API}/pricehistorical?fsym=${coin}&tsyms=${currency}&ts=${TS}&api_key=${API_KEY}`
  );
  const data = await rps.json();
  return data[coin][currency];
}
