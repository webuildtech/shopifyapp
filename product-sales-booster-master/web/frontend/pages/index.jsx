import * as Polaris from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { trophyImage } from "../assets";
import useProducts from "../hooks/api/useProducts";
import { ProductMarginTable } from "../components/ProducMarginTable";
import { useAppContext } from "../context/AppContext";
import useUpdateMargin from "../hooks/api/useUpdateMargin";
import { useState } from "react";
import { AnalyticsSection } from "../components/AnalyticsSection";
//import useRouter from "use-react-router";

export default function HomePage() {
  //const router = useRouter();
  const appEmbedInfoBanner = (
    <Polaris.Banner
      title="App Embed is not enabled"
      status="warning"
      action={{
        content: "Enable App Embed",
        //onAction: () => router.history.push("/setup"),
      }}
    >
      <p>
        App embed is a piece of code that we add to your theme. It allows us to
        show the upsell discounts on your product pages. You'll need to enable
        app embed to use AI Upsello.
      </p>
    </Polaris.Banner>
  );

  return (
    <Polaris.Page
      title="AI Upsello - Home"
      subtitle="Product Upsell Recommendations"
      secondaryActions={[
        {
          content: "Discount Settings",
          onAction: () => console.log("clicked"),
        },
      ]}
    >
      <Polaris.Layout>
        <Polaris.Layout.Section>{appEmbedInfoBanner}</Polaris.Layout.Section>
        <Polaris.Layout.Section>

        </Polaris.Layout.Section>

        <Polaris.Layout.Section>
          <AnalyticsSection />
        </Polaris.Layout.Section>
      </Polaris.Layout>
    </Polaris.Page>
  );
}
