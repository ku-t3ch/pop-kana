import { type AppType } from "next/dist/shared/lib/utils";
import "@/styles/globals.css";
import SEO from "../next-seo.config";
import { DefaultSeo } from "next-seo";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    console.log("%cอย่านะครับถือว่าผมขอ", "font-size:5em;color:red;");
    console.log(`%c อย่าใช้ bot เลยนะครับขอร้อง`, "font-size:2em");
  }, []);

  return (
    <>
      <DefaultSeo {...SEO} />
      <Toaster position="top-center" reverseOrder={false} />
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
