import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="icon.png" />
        <link rel="manifest" href="manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="shortcut icon" href="/icon.png" />
        <meta name="theme-color" content="#FFF" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

