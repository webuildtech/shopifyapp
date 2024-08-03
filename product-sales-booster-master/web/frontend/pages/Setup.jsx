import * as Polaris from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { ProductMarginTable } from "../components/ProducMarginTable";
import useUpdateMargin from "../hooks/api/useUpdateMargin";
import { useAppContext } from "../context/AppContext";
import appEmbedHelp from "../assets/app-embed-help.png";

export default function PageName() {
  const { context, setContext } = useAppContext();

  const enableAppEmbedHelpSection = (
    <Polaris.TextContainer>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <div>
          <Polaris.TextContainer>
            App embed is a piece of code that we add to your theme to enable. It
            allows us to show the upsell discounts on your product pages.
          </Polaris.TextContainer>
          <br />
          <Polaris.Heading>How to enable app embed?</Polaris.Heading>
          <Polaris.TextContainer>
            <ol>
              <li style={{ marginBottom: "10px" }}>
                <span>Open the </span>
                <Polaris.Link
                  url={`https://admin.shopify.com/store/${"ai-upsello-test-store"}/themes/144753688876/editor?context=apps&appEmbed=ef435061-2a5f-4cf1-a6ce-11e4edce99ee%2Fapp-block`}
                  external
                >
                  <b>App Embed Page</b>
                </Polaris.Link>
              </li>
              <li style={{ marginBottom: "10px" }}>
                Click on the Enable Switch for the AI Upsello app:
              </li>
              <br />
              <img src={appEmbedHelp} />
              <br />
              <br />
              <li style={{ marginBottom: "10px" }}>
                Click <b>Save</b> to save the settings
              </li>
            </ol>
          </Polaris.TextContainer>
        </div>
      </div>
    </Polaris.TextContainer>
  );



  return (
    <Polaris.Page
      title="AI Upsello - Setup"
      subtitle="Let's get started"
      primaryAction={{
        content: "Save",
        disabled: context.updatedProductMargins.length === 0,
        onAction: async () => {
          for (let product of context.updatedProductMargins) {
            setMarginUpdateStatus(product.id, true);
            await updateMargin(product.id, product.margin);
            setMarginUpdateStatus(product.id, false);
          }

          setContext({
            ...context,
            updatedProductMargins: [],
          });
        },
      }}
    >
      <Polaris.Layout>
        <Polaris.Layout.Section>
          <Polaris.Card
            sectioned
          >
            
            <Polaris.Card.Section>
              {enableAppEmbedHelpSection}
            </Polaris.Card.Section>
          </Polaris.Card>
        </Polaris.Layout.Section>
      </Polaris.Layout>
    </Polaris.Page>
  );
}
