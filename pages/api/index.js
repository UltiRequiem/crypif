import { current, historical } from "../../lib/cryptoData.js";

/**
 * Example request: {"date":"2020-01-01","quantity":500, "currency":"USD","coin":"BTC"}
 */
export default async function handler(req, res) {
  if (req.method != "POST") {
    res.status(405).json({
      error: "Method not allowed",
    });
  }

  const { date, coin, currency, quantity } = req.body;

  const rightNow = await current(coin, currency);
  const past = await historical(date, coin, currency);

  res.json({
    rightNow,
    past,
  });
}
