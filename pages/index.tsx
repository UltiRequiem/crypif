import type { CryptoInput, CryptoResponse } from "lib/cryptoData";
import type { FormEventHandler } from "react";
import { percentageChange, getKeyByValue } from "lib/utils";
import { useState } from "react";
import useSWR from "swr";

import { Select } from "antd";

const { Option } = Select;

import styles from "styles/index.module.css";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

interface CryptoData {
  shortname: string;
  fullname: string;
}

export default function Home() {
  const { data: possibleCryptos, error } = useSWR<CryptoData[]>(
    "/crypto.json",
    fetcher
  );

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
            onChange={(event) =>
              setInput({ ...input, date: event.target.value })
            }
          />
        </label>

        <label>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            <Option value="1">Not Identified</Option>
            <Option value="2">Closed</Option>
            <Option value="3">Communicated</Option>
            <Option value="4">Identified</Option>
            <Option value="5">Resolved</Option>
            <Option value="6">Cancelled</Option>
            {possibleCryptos.map((coin) => (
              <Option key={coin.shortname} value={coin.shortname}>
                {coin.fullname}
              </Option>
            ))}
          </Select>
        </label>

        <label>
          Currency:
          <input
            type="text"
            placeholder={input.currency}
            onChange={(event) => {
              getKeyByValue(possibleCryptos, event.target.value);
              setInput({
                ...input,
                currency: getKeyByValue(possibleCryptos, event.target.value),
              });
            }}
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
