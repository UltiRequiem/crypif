import useSWR from "swr";
import { useState } from "react";
import { InputNumber, Select } from "antd";
import { fetcher, percentageChange } from "lib/utils";

import type { FormEventHandler } from "react";
import type { CryptoNames, CryptoResponse } from "lib/crypto-data";

import styles from "styles/index.module.css";

export default function Home() {
  const { data: possibleCryptos, error } = useSWR<CryptoNames[]>(
    "/crypto.json",
    fetcher
  );

  const [date, setDate] = useState<Nullable<string>>();
  const [cryptoCurrency, setCrypto] = useState<Nullable<string>>();
  const [cryptoQuantity, setQuantity] = useState(0);

  const [data, setData] = useState<Nullable<CryptoResponse>>();

  const submitHandler: FormEventHandler = async (event) => {
    event.preventDefault();

    const data = JSON.stringify({
      date,
      crypto: cryptoCurrency,
      currency: "USD",
    });

    console.log(data);

    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, coin: cryptoCurrency, currency: "USD" }),
    });

    if (response.status >= 400 && response.status < 600) {
      return alert(`There is no data for "${cryptoCurrency}".`);
    }

    setData(await response.json());
  };

  if (error) return <div>Failed to load</div>;
  if (!possibleCryptos) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>Crypif</h1>
      <form onSubmit={submitHandler}>
        <label>
          Date:
          <input
            required
            type="date"
            onChange={(event) => setDate(event.target.value)}
          />
        </label>

        <label>
          Crypto:
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toString()
                .toLowerCase()
                .localeCompare(optionB.children.toString().toLowerCase())
            }
            onChange={setCrypto}
          >
            {possibleCryptos.map((coin) => (
              <Select.Option key={coin.shortname} value={coin.shortname}>
                {coin.fullname}
              </Select.Option>
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
            worth <span className={styles.money}>{data.past.toFixed(2)}</span>,
            the current value is{" "}
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
