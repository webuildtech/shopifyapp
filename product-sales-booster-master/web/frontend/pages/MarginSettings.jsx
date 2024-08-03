import * as Polaris from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { ProductMarginTable } from "../components/ProducMarginTable";
import useUpdateMargin from "../hooks/api/useUpdateMargin";
import { useAppContext } from "../context/AppContext";

export default function PageName() {
  const { context, setContext } = useAppContext();
  const { updateMargin } = useUpdateMargin();

  const setMarginUpdateStatus = (id, updating) => {
    setContext({
      ...context,
      updatedProductMargins: context.updatedProductMargins.map((margin) => {
        if (margin.id === id) {
          return {
            ...margin,
            updating,
          };
        }
        return margin;
      }),
    });
  };

  return (
    <Polaris.Page
    title="AI Upsello - Discount Settings"
    subtitle="How much you are willing to discount each product?"
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
          <Polaris.Card>
            <Polaris.Card.Section>
              <Polaris.TextContainer>
                <Polaris.Heading>Product Margins</Polaris.Heading>
                <Polaris.TextContainer>
                  Set the maximum margin (or percentage of the product price)
                  that you are willing to offer for each product. help AI
                  Upsello recommend products that will help you increase your
                  sales.
                </Polaris.TextContainer>
                <br />
                <br />
              </Polaris.TextContainer>
              <ProductMarginTable />
            </Polaris.Card.Section>
          </Polaris.Card>
        </Polaris.Layout.Section>
      </Polaris.Layout>
    </Polaris.Page>
  );
}
