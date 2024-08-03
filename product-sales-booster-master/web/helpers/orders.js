import shopify from "../shopify.js";

const getOrdersQuery = (cursor) => {
  return `
    {
      orders(first: 5, ${cursor ? `after: "${cursor}"` : ""}) {
        edges {
          node {
            id
            name
            discountCodes
            currentSubtotalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            lineItems(first: 5) {
              edges {
                node {
                  id
                  quantity
                  product {
                    id
                  }
                  variant {
                    id
                  }
                }
              }
            }     
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;
};

// get discount names as well
export const getOrders = async (session, cursor) => {
  const client = new shopify.api.clients.Graphql({
    session,
  });

  try {
    const response = await client.query({
      data: {
        query: getOrdersQuery(cursor),
      },
    });

    // extaracts orders and line items from nodes
    const orders = response.body.data.orders.edges.map((edge) => {
      const lineItems = edge.node.lineItems.edges.map((edge) => {
        return edge.node;
      });

      return {
        ...edge.node,
        lineItems,
      };
    });

    return {
      orders,
      hasNextPage: response.body.data.orders.pageInfo.hasNextPage,
      cursor: response.body.data.orders.pageInfo.endCursor,
    };
  } catch (e) {
    console.log(e?.response);
  }

  return {
    orders: [],
    hasNextPage: false,
    cursor: "",
  };
};
