import { FormEventHandler, useState } from "react";
import type { CryptoInput, CryptoResponse } from "lib/cryptoData";

export default function Home() {
  const [input, setInput] = useState<Partial<CryptoInput>>({
    coin: "BTC",
    currency: "USD",
  });

  const [data, setData] = useState<Nullable<CryptoResponse>>(null);

  const submitHandler: FormEventHandler = async (event) => {
    event.preventDefault();

    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    setData(await response.json());
  };

  return (
    <div>
      <h1>Crypif</h1>
      <form onSubmit={submitHandler}>
        <label>
          Date:
          <input
            required
            type="date"
            onChange={(event) =>
              setInput({ ...input, date: event.target.value })
            }
          />
        </label>

        <label>
          Crypto:
          <input
            placeholder="BTC"
            type="text"
            onChange={(event) =>
              setInput({ ...input, coin: event.target.value })
            }
          />
        </label>

        <label>
          Currency:
          <input
            type="text"
            placeholder="USD"
            onChange={(event) =>
              setInput({ ...input, currency: event.target.value })
            }
          />
        </label>

        <input type="submit" value="Submit" />
      </form>

      {data && (
        <>
          In {input.date} {input.coin} was ${data.past}. Currently it is $
          {data.rightNow}.
        </>
      )}
    </div>
  );
}
