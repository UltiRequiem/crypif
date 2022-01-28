import type { NextApiRequest, NextApiResponse } from "next";
import type { CryptoInput, CryptoResponse } from "lib/cryptoData";
import type { MaybeError } from "lib/utils";
import { current, historical } from "lib/cryptoData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MaybeError<CryptoResponse>>
) {
  if (req.method != "POST") {
    res.status(405).json({ error: "Method not allowed" });
  } else if (!req.body) res.status(400).json({ error: "No request body" });

  const { date, coin, currency }: CryptoInput = req.body;

  if (!date || !coin || !currency) {
    res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    res.json({
      rightNow: await current(coin, currency),
      past: await historical(date, coin, currency),
    });
  } catch {
    res.status(400).json({ error: `There is no data for "${coin}".` });
  }
}

