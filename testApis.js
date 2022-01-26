// This file runs with Deno, is only to test some endpoints

import { config } from "https://deno.land/x/dotenv/mod.ts";

const BASE_URL = "https://min-api.cryptocompare.com/data";

config({ path: "./.env.local" });

const API_KEY = Deno.env.get("API_KEY");

async function current(name = "BTC", currency = "USD") {
  const rps = await fetch(`${BASE_URL}/price?fsym=${name}&tsyms=${currency}`);
  const data = await rps.json();
  return data[currency];
}

async function historical(date, coin = "BTC", currency = "USD") {
  const rps = await fetch(
    `${BASE_URL}/pricehistorical?fsym=${coin}&tsyms=${currency}&ts=${Math.round(
      new Date(date).valueOf() / 1000
    )}&api_key=${API_KEY}`
  );
  const data = await rps.json();
  return data[coin][currency];
}

const percentage = (percent, total) => (percent * 100) / total;

const moneyInvested = 100;
const dateInvested = "2020-01-01";

const rightNow = await current();
const past = await historical(dateInvested);

const percentageOfBTC = percentage(moneyInvested, past);

console.log(`In ${dateInvested} BTC was $${past} now it is $${rightNow}.`);

console.log(
  `With $${moneyInvested} invested on ${dateInvested}, you bought ${percentageOfBTC.toFixed(
    2
  )}% of one BTC. Today that values $${(
    (percentageOfBTC * rightNow) /
    100
  ).toFixed(2)}`
);
