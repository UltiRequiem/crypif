import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState({});
  const [data, setData] = useState({});

  const summitHandler = (event, data) => {
    event.preventDefault();

    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => setData(res));
  };

  console.log(input);
  console.log(data);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1>Crypif</h1>
      <form onSubmit={(event) => summitHandler(event, input)}>
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
          Crypto:{" "}
          <input
            placeholder="BTC"
            type="text"
            onChange={(event) =>
              setInput({ ...input, crypto: event.target.value })
            }
          />
        </label>

        <label>
          Currency:{" "}
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

      <div>
        In {input.date} {input.crypto} was ${data.past}. Currently it is $
        {data.rightNow}.
      </div>
    </div>
  );
}
