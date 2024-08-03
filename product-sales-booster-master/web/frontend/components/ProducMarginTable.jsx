import * as Polaris from "@shopify/polaris";
import useProducts from "../hooks/api/useProducts";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

export function ProductMarginTable() {
  const { setContext, context } = useAppContext();

  const { products, isLoading } = useProducts();
  const [margins, setMargins] = useState([]);

  const onMarginChange = (index, value) => {
    if (margins.length !== products.length) return;
    const newMargins = [...margins];
    newMargins[index].margin = value;
    newMargins[index].changed = true;
    setMargins(newMargins);

    setContext({
      ...context,
      updatedProductMargins: margins.filter((margin) => margin.changed),
    });
  };

  const currencyCodeToSymbol = (currencyCode) => {
    switch (currencyCode) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "JPY":
        return "¥";
      case "CAD":
        return "C$";
      case "AUD":
        return "A$";
      default:
        return "$";
    }
  }

  console.log(margins);

  useEffect(() => {
    if (isLoading) return;
    const newMargins = margins.map((margin) => {
      return {
        ...margin,
        updating: context.updatedProductMargins.find(
          (updatedMargin) => updatedMargin.id === margin.id
        )?.updating,
        changed: context.updatedProductMargins.find(
          (updatedMargin) => updatedMargin.id === margin.id
        )?.changed,
      };
    });

    setMargins(newMargins);
  }, [context.updatedProductMargins]);

  useEffect(() => {
    if (isLoading) return;
    const newMargins = products.map((product) => {
      return {
        id: product.id,
        margin: product.margin,
        updating: false,
        changed: false,
      };
    });
    setMargins(newMargins);
  }, [products, isLoading]);

  const tableRows = isLoading
    ? null
    : products.map((product, index) => (
        <Polaris.IndexTable.Row key={product.id}>
          <Polaris.IndexTable.Cell>
            <img
              src={product.variants[0].imageSrc}
              style={{ maxWidth: "50px", objectFit: "contain" }}
            />
          </Polaris.IndexTable.Cell>
          <Polaris.IndexTable.Cell>
            <Polaris.TextContainer>{product.title.length > 50 ? product.title.substring(0, 60) + "..." : product.title}</Polaris.TextContainer>
          </Polaris.IndexTable.Cell>
          <Polaris.IndexTable.Cell>
            {context.updatedProductMargins.find(
              (margin) => margin.id === product.id
            )?.updating ? (
              <Polaris.Spinner />
            ) : (
              <Polaris.TextField
                onChange={(value) => onMarginChange(index, value/100)}
                suffix="%"
                value={
                  margins.length === products.length ? margins[index].margin*100 : 0
                }
              />
            )}
          </Polaris.IndexTable.Cell>
          <Polaris.IndexTable.Cell>
            <Polaris.TextContainer>{margins.length === products.length ? (margins[index].margin*product.variants[0].price).toFixed(2) : 0 }{currencyCodeToSymbol(product.variants[0].currencyCode)}</Polaris.TextContainer>
          </Polaris.IndexTable.Cell>
        </Polaris.IndexTable.Row>
      ));

  return (
    <Polaris.IndexTable
      loading={isLoading}
      resourceName={{ singular: "product", plural: "products" }}
      itemCount={isLoading ? 0 : products.length}
      selectable={false}
      headings={[
        { title: "Image" },
        { title: "Name" },
        { title: "Max Product Discount" },
        { title: "Max Discount Limit"}
      ]}
    >
      {tableRows}
    </Polaris.IndexTable>
  );
}
