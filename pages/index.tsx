import { useState } from "react";
import { InputNumber, DatePicker, Space, message, Button } from "antd";
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

    if (!date || !cryptoCurrency) {
      return message.error("Please fill the crypto and date fields");
    }

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
      <div className={styles.form}>
        <label>
          Date:
          <DatePicker
            disabledDate={(d) => !d || d.isSameOrBefore("2010-01-01")}
            onChange={(date) => setDate(date.format("YYYY-MM-DD"))}
          />
        </label>
        <label>
          Crypto:
          <Select onChange={setCrypto}>
            {cryptosNames.map((crypto) => (
              <SelectOption key={crypto.shortname} value={crypto.shortname}>
                {crypto.fullname}
              </SelectOption>
            ))}
          </Select>
        </label>

        <Button
          className={styles.button}
          type="primary"
          onClick={submitHandler}
        >
          Calculate
        </Button>
      </div>
    </div>
  );
}
