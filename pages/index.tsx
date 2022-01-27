import type { CryptoInput, CryptoResponse } from "lib/cryptoData";
import type { FormEventHandler } from "react";
import { percentageChange } from "lib/utils";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState<Partial<CryptoInput>>({
    coin: "BTC",
    currency: "USD",
  });

  const [quanity, setQuantity] = useState(0);

  console.log(quanity);

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

    if (response.status >= 400 && response.status < 600) {
      return alert(`There is no data for "${input.coin}".`);
    }

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

      <input
        type="text"
        onChange={(event) => setQuantity(+event.target.value)}
      />

      {data && (
        <>
          In {input.date} {input.coin} was ${data.past}. Currently it is $
          <p>
            It has {data.rightNow > data.past ? "increased" : "decreased"} by{" "}
            {Math.abs(percentageChange(data.past, data.rightNow))}%
          </p>
        </>
      )}
    </div>
  );
}
