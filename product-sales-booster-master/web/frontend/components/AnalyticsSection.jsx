import * as Polaris from "@shopify/polaris";
import * as PolarisIcons from "@shopify/polaris-icons";
import useAnalytics from "../hooks/api/useAnalytics";
import { useId } from "react";

// Placeholder analytics with daily sales and daily orders
// contains chart displaying sales and orders over time
export function AnalyticsSection() {
  const { analytics, error, isLoading } = useAnalytics();
  if (isLoading || error || !analytics) {
    return (
      <Polaris.Layout.Section>
        <Polaris.Card>
          <Polaris.SkeletonBodyText />
        </Polaris.Card>
      </Polaris.Layout.Section>
    );
  }
  const {
    totalSessions,
    topViewedProducts,
    topBounceRateProducts,
    topLowestBounceRateProducts,
    attributedOrdersCount,
  } = analytics;

  /* Should display the following card:
    1) Icon should have a color of soft green
    2) Large text with the total sessions count (e.g. 1,000) should be black
    3) Small text with the total sessions label (e.g. Total Sessions) should be gray a bit

    Content should be centered vertically and horizontally
    Content should flow from top to bottom

    Polaris version 9.16.0
    TailwindCSS
  */
  
  const truncateString = (str, num) => {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }
  
  
  const totalSessionsMarkup = (
    <Polaris.Card>
      <Polaris.VerticalStack
        align="center"
        inlineAlign="center"
        spacing="tight"
        gap={2}
      >
        <div className="fill-current w-16 h-16 p-4 text-sky-600 bg-sky-200 rounded-full mb-3">
          <PolarisIcons.DataVisualizationMajor />
        </div>


        <div className="text-3xl font-bold text-gray-900">
          {totalSessions}
        </div>
        <div className="text-sm text-gray-500">Total Sessions</div>
      </Polaris.VerticalStack>
    </Polaris.Card>
  );
  
    const totalOrdersMarkup = (
      <Polaris.Card>
        <Polaris.VerticalStack
          align="center"
          inlineAlign="center"
          spacing="tight"
          gap={2}
        >
          <div className="fill-current w-16 h-16 p-4 text-green-600 bg-green-200 rounded-full mb-3">
            <PolarisIcons.OrdersMajor />
          </div>

          <div className="text-3xl font-bold text-gray-900">
            {attributedOrdersCount}
          </div>
          <div className="text-sm text-gray-500">Attributed orders</div>
        </Polaris.VerticalStack>
      </Polaris.Card>
    );
  
  const topViewedProductsMarkup = (
    <Polaris.Card>
      <div className="mb-6">
        <Polaris.Text variant="headingMd">Top Viewed Products</Polaris.Text>
      </div>
      <Polaris.Listbox>
        {topViewedProducts.map((product, index) => (
          <Polaris.Listbox.Option value={product.id}>
            <div className="flex items-center justify-between mb-4 w-full">
              <span className="flex gap-5 items-center">
                <Polaris.Thumbnail
                  size="small"
                  source={product.variants[0].imageSrc}
                  alt={product.title}
                />
                <Polaris.Text>
                  {index + 1}. {truncateString(product.title, 35)}
                </Polaris.Text>
              </span>
              <span className="text-sm text-gray-500">
                {product.views} views
              </span>
            </div>
          </Polaris.Listbox.Option>
        ))}
      </Polaris.Listbox>
    </Polaris.Card>
  );

  const topBounceRateProductsMarkup = (
    <Polaris.Card>
      <div className="mb-6">
        <Polaris.Text variant="headingMd">
          Top Bounce Rate Products
        </Polaris.Text>
      </div>
      <Polaris.Listbox>
        {topBounceRateProducts.map((product, index) => (
          <Polaris.Listbox.Option value={product.id}>
            <div className="flex items-center justify-between mb-4 w-full">
              <span className="flex gap-5 items-center">
                <Polaris.Thumbnail
                  size="small"
                  source={product.variants[0].imageSrc}
                  alt={product.title}
                />
                <Polaris.Text>
                  {index + 1}. {truncateString(product.title, 35)}
                </Polaris.Text>
              </span>
              <span className="text-sm text-gray-500">
                {parseInt(product.bounceRate)}%
              </span>
            </div>
          </Polaris.Listbox.Option>
        ))}
      </Polaris.Listbox>
    </Polaris.Card>
  );

  const topLowestBounceRateProductsMarkup = (
    <Polaris.Card>
      <div className="mb-6">
        <Polaris.Text variant="headingMd">Top Lowest Bounce Rate Products</Polaris.Text>
      </div>
      <Polaris.Listbox>
        {topLowestBounceRateProducts.map((product, index) => (
          <Polaris.Listbox.Option value={product.id}>
            <div className="flex items-center justify-between mb-4 w-full">
              <span className="flex gap-5 items-center">
                <Polaris.Thumbnail
                  size="small"
                  source={product.variants[0].imageSrc}
                  alt={product.title}
                />
                <Polaris.Text>
                  {index + 1}. {truncateString(product.title, 35)}
                </Polaris.Text>
              </span>
              <span className="text-sm text-gray-500">
                {parseInt(product.bounceRate)}%
              </span>
            </div>
          </Polaris.Listbox.Option>
        ))}
      </Polaris.Listbox>
    </Polaris.Card>
  );

  return (
    <>
      <div className="mb-3">
        <Polaris.Text variant="heading2xl">Analytics</Polaris.Text>
      </div>
      <Polaris.VerticalStack gap={3}>
        <Polaris.Grid columns={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}>
          <Polaris.Grid.Cell>{totalSessionsMarkup}</Polaris.Grid.Cell>
          <Polaris.Grid.Cell>{totalOrdersMarkup}</Polaris.Grid.Cell>
          <Polaris.Grid.Cell>{totalSessionsMarkup}</Polaris.Grid.Cell>
        </Polaris.Grid>
        <Polaris.Grid columns={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}>
          {topViewedProductsMarkup}
          {topBounceRateProductsMarkup}
        </Polaris.Grid>
      </Polaris.VerticalStack>
    </>
  );
}
