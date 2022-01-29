import { useState } from "react";
import { InputNumber, DatePicker, message } from "antd";
import { percentageChange } from "lib/utils";
import cryptosNames from "lib/crypto-names";
import { Select, SelectOption } from "components";

import type { FormEventHandler } from "react";
import type { CryptoResponse } from "lib/crypto-data";

import styles from "styles/index.module.css";

export default function Home() {
  const [date, setDate] = useState("");
  const [cryptoCurrency, setCrypto] = useState("");
  const [cryptoQuantity, setQuantity] = useState(0);
  const [data, setData] = useState<Nullable<CryptoResponse>>();

  const submitHandler: FormEventHandler = async (event) => {
    event.preventDefault();

    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, coin: cryptoCurrency, currency: "USD" }),
    });

    if (response.status >= 400 && response.status < 600) {
      return message.error(`There is no data for "${cryptoCurrency}".`);
    }

    setData(await response.json());
  };

  return (
    <div className={styles.container}>
      <h1>Crypif</h1>
      <form onSubmit={submitHandler}>
        <label>
          Date:
          <DatePicker
            onChange={(value) => setDate(value.format("YYYY-MM-DD"))}
          />
        </label>

        <label>
          Crypto:
          <Select onChange={setCrypto}>
            {cryptosNames.map((coin) => (
              <SelectOption key={coin.shortname} value={coin.shortname}>
                {coin.fullname}
              </SelectOption>
            ))}
          </Select>
        </label>

        <input type="submit" value="Submit" />
      </form>

      <InputNumber onChange={(value) => setQuantity(value as number)} />

      {data && (
        <>
          <p>
            On <span className={styles.date}>{date}</span> {cryptoCurrency} was
            worth <span className={styles.money}>{data.past}</span>, the current
            value is{" "}
            <span className={styles.money}>{data.rightNow.toFixed(2)}</span>.
          </p>

          {cryptoQuantity > 0 && (
            <p>
              That {cryptoQuantity} costed{" "}
              <span className={styles.money}>{cryptoQuantity * data.past}</span>{" "}
              and now it values{" "}
              <span className={styles.money}>
                {cryptoQuantity * data.rightNow}{" "}
              </span>
              .
            </p>
          )}
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
