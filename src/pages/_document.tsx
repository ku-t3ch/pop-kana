// import { NextPage } from 'next'

// interface Props {}

// const _document: NextPage<Props> = () => {
//     return (
//         <>
//         <script async src="https://analytics.umami.is/script.js" data-website-id="cd5489a2-fba0-48b1-aeee-5304d777e06e"></script>
//         </>
//     )
// }

// export default _document

import { NextPage } from "next";
import { Html, Head, NextScript, Main } from "next/document";

interface Props {}

const _document: NextPage<Props> = () => {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script async src="https://analytics.umami.is/script.js" data-website-id="cd5489a2-fba0-48b1-aeee-5304d777e06e"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default _document;