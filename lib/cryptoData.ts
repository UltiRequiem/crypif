const BASE_API = "https://min-api.cryptocompare.com/data";

const API_KEY = process.env.API_KEY;
export async function current(
  cryptoCurrency = "BTC",
  currency = "USD"
): Promise<number> {
  const rps = await fetch(
    `${BASE_API}/price?fsym=${cryptoCurrency}&tsyms=${currency}`
  );
  const data = await rps.json();
  return data[currency];
}

export async function historical(
  date: string,
  cryptoCurrency = "BTC",
  currency = "USD"
): Promise<number> {
  const TS = ~~(new Date(date).valueOf() / 1000);
  const rps = await fetch(
    `${BASE_API}/pricehistorical?fsym=${cryptoCurrency}&tsyms=${currency}&ts=${TS}&api_key=${API_KEY}`
  );
  const data = await rps.json();
  return data[cryptoCurrency][currency];
}

export interface CryptoInput {
  date: string;
  currency: string;
  coin: string;
}

export interface CryptoResponse {
  past: number;
  rightNow: number;
}
