import type { NextApiRequest, NextApiResponse } from "next";
import type { CryptoInput, CryptoResponse } from "lib/crypto-data";
import type { MaybeError } from "lib/utils";
import { current, historical } from "lib/crypto-data";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<MaybeError<CryptoResponse>>
) {
  if (request.method != "POST") {
    response.status(405).json({ error: "Method not allowed" });
  } else if (!request.body) {
    response.status(400).json({ error: "No request body" });
  }

  const { date, coin, currency }: CryptoInput = request.body;

  if (!date || !coin || !currency) {
    response.status(400).json({ error: "Missing required parameters" });
  }

  try {
    response.json({
      rightNow: await current(coin, currency),
      past: await historical(date, coin, currency),
    });
  } catch {
    response.status(400).json({ error: `There is no data for "${coin}".` });
  }
}
