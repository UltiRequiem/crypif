import type { AppProps } from "next/app";

import "antd/dist/antd.css";
import "styles/global.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
