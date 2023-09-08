import { type AppType } from "next/dist/shared/lib/utils";
import "@/styles/globals.css";
import SEO from "../next-seo.config";
import { DefaultSeo } from "next-seo";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <DefaultSeo {...SEO} /> 
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
