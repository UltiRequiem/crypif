import type { CryptoInput, CryptoResponse } from "lib/cryptoData";
import type { FormEventHandler } from "react";
import { percentageChange, percentage } from "lib/utils";
import { useState } from "react";

import styles from "styles/index.module.css";

export default function Home() {
  const [input, setInput] = useState<Partial<CryptoInput>>({
    coin: "BTC",
    currency: "USD",
  });

  const [cryptoQuantity, setQuantity] = useState(0);

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
    <div className={styles.container}>
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
            placeholder={input.coin}
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
            placeholder={input.currency}
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
          <p>
            On <span className={styles.date}> {input.date}</span> {input.coin}{" "}
            was worth{" "}
            <span className={styles.money}>{data.past.toFixed(2)}</span>, the
            current value is{" "}
            <span className={styles.money}>{data.rightNow.toFixed(2)}</span>.
          </p>

          <p>
            That {cryptoQuantity} costed{" "}
            <span className={styles.money}>{cryptoQuantity * data.past}</span>{" "}
            and now it values{" "}
            <span className={styles.money}>
              {cryptoQuantity * data.rightNow}{" "}
            </span>
            .
          </p>

          <p>
            That means that the percentage change was{" "}
            <span className={styles.percentage}>
              {-percentageChange(data.past, data.rightNow).toFixed(2)}%
            </span>
            .
          </p>
        </>
      )}
    </div>
  );
}
