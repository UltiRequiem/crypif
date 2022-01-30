import { useState } from "react";
import { InputNumber, DatePicker, message, Button } from "antd";
import cryptosNames from "lib/crypto-names";
import { Select, SelectOption, ColoredText } from "components";

import type { FormEventHandler } from "react";
import type { CryptoResponse } from "lib/crypto-data";

import styles from "styles/index.module.css";
import Link from "next/link";

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
      <div className={styles.layout}>
        <div className={styles.form}>
          <label>
            Date
            <DatePicker
              disabledDate={(d) =>
                !d ||
                d.isSameOrBefore("2010-01-01") ||
                d.isSameOrAfter(new Date())
              }
              onChange={(date) => setDate(date.format("YYYY-MM-DD"))}
            />
          </label>
          <label>
            Crypto
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
          {data && (
            <label>
              Crypto Quantity
              <InputNumber
                style={{ color: "black" }}
                min={0}
                type="number"
                onChange={(value) => setQuantity(+value)}
              />
            </label>
          )}
        </div>

        {data && (
          <div className="data">
            <p>
              On <ColoredText color="lightblue" value={date} />{" "}
              <ColoredText value={cryptoCurrency} color="brown" /> was worth{" "}
              <ColoredText color="green" value={`$${data.past}`} />
            </p>
            <p>
              Today, it is worth{" "}
              <ColoredText color="green" value={`$${data.rightNow}`} />
            </p>

            {cryptoQuantity > 0 && (
              <p>
                Your{" "}
                <ColoredText
                  color="green"
                  value={`$${cryptoQuantity * data.past}`}
                />{" "}
                turned into{" "}
                <ColoredText
                  color="green"
                  value={`$${cryptoQuantity * data.rightNow}`}
                />
              </p>
            )}
          </div>
        )}
      </div>
      <div className={styles.push}></div>
      <footer>
        <li>
          <Link href="https://ultirequiem.com">ultirequiem.com</Link>
        </li>
        <li>
          <Link href="https://github.com/UltiRequiem/crypif">github</Link>
        </li>
      </footer>
    </div>
  );
}
