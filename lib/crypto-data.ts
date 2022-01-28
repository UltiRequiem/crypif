const BASE_API = "https://min-api.cryptocompare.com/data";
const API_KEY = process.env.API_KEY;

export async function current(
  cryptoCurrency = "BTC",
  currency = "USD"
): Promise<number> {
  const response = await fetch(
    `${BASE_API}/price?fsym=${cryptoCurrency}&tsyms=${currency}&api_key=${API_KEY}`
  );
  const data = await response.json();
  return data[currency];
}

export async function historical(
  date: string,
  cryptoCurrency = "BTC",
  currency = "USD"
): Promise<number> {
  const TS = Math.trunc(new Date(date).valueOf() / 1000);
  const response = await fetch(
    `${BASE_API}/pricehistorical?fsym=${cryptoCurrency}&tsyms=${currency}&ts=${TS}&api_key=${API_KEY}`
  );
  const data = await response.json();
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

export interface CryptoNames {
  shortname: string;
  fullname: string;
}
