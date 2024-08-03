import shopify from "../shopify.js";
import {
  getProductViews,
  getProductTypes,
  getAverageProductStock,
  getProductTypeViews,
  getTimeSpent,
  calculateDiscountMultiplier,
  getMargins,
} from "./stats.js";
import { getAllProducts, getRandomlySelectedProducts } from "./product.js";

export const createAppDiscount = async (session, discounts) => {
  const client = new shopify.api.clients.Graphql({ session });
  const discountCode = "aiup_" + Math.random().toString(36).substring(2, 15);
  const metafieldsValue = JSON.stringify(discounts).replace(/"/g, '\\"');;

  
  const res = await client.query({
    data: {
      query: `mutation {
      discountCodeAppCreate(
        codeAppDiscount: {
          title: "AIUpsello Volume Discount",
          code: "${discountCode}",
          combinesWith: {
            productDiscounts: true,
          }
          functionId: "01H5AR0E0396Z11YSZHV1FFRX3",
          startsAt: "${new Date().toISOString()}",
          metafields: [
            {
              namespace: "volume-discount",
              key: "function-configuration",
              value: "${metafieldsValue}",
              type: "json"
            }
          ]
        }
      ) {
        userErrors {
          field
          message
        }
      }
    }`,
    },
  });


  console.log(res.body.data.discountCodeAppCreate?.userErrors);
  console.log(res.body.data.discountCodeAppCreate);

  return discountCode;
}

export const createDiscount = async (session, discountInfo) => {
  const client = new shopify.api.clients.Graphql({ session });

  const discountCode =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  const res2 = await client.query({
    data: {
      query: `
        mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
          discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
            codeDiscountNode {
              id
            }
            userErrors {
              field
              message
            }
          }
        }`,
      variables: {
        basicCodeDiscount: {
          appliesOncePerCustomer: true,
          code: discountCode,
          combinesWith: {
            //productDiscounts: true,
            shippingDiscounts: true,
            //orderDiscounts: true,
            //orderDiscounts: true,
          },
          customerGets: {
            //appliesOnOneTimePurchase: true,
            //appliesOnSubscription: true,
            items: {
              all: true,
              collections: {
                //add: [""],
                //remove: [""],
              },
              products: {
                //productVariantsToAdd: [],
                //productVariantsToRemove: [""],
                //productsToAdd: discountInfo.productIds.map(
                //  (id) => `gid://shopify/Product/${id}`
                //),
                //productsToRemove: [""],
              },
            },
            value: {
              discountAmount: {
                amount: discountInfo.discountValue,
                appliesOnEachItem: false,
              },
            },
          },
          customerSelection: {
            all: true,
          },
          //endsAt: "",
          //recurringCycleLimit: 1,
          startsAt: new Date().toISOString(),
          title: discountInfo.title,
          usageLimit: 1,
        },
      },
    },
  });

  console.log(res2.body.data.discountCodeBasicCreate);
  /*const discount_code = new shopify.api.rest.DiscountCode({ session });
  discount_code.price_rule_id = priceRule.id;
  discount_code.code =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  await discount_code.save({
    update: true,
  });

  return discount_code;*/
  return discountCode;
};


// NENAUDOT ALL PRODUCTS
export const getCalculatedDiscounts = async (clientId, productIds, shop) => {
  const allProducts = await getAllProducts(shop);
  const allProductViews = await getProductViews(clientId, productIds);
  const allProductTypes = await getProductTypes(productIds);
  const averageStock = await getAverageProductStock(allProducts);
  const allProductTypeViews = await getProductTypeViews(
    clientId,
    allProductTypes
  );
  const randomlySelectedProducts = await getRandomlySelectedProducts(shop);
  const margins = await getMargins(allProducts);
  const millisSpentOnProducts = await getTimeSpent(clientId, productIds);

  const discounts = [];

  for (const productId of productIds) {
    try {
      const product = allProducts.filter((product) => {
        return product.id == productId;
      })[0];
      
      const margin = margins.find((margin) => {
        return margin.productId == productId;
      }).margin;

      const secondsSpentOnProduct =
        millisSpentOnProducts.filter((timeSpent) => {
          return timeSpent.productId == productId;
        })[0].totalTimeSpentOnProduct / 1000;
      const productViews = allProductViews.filter((productView) => {
        return productView.productId == productId;
      })[0].productViewCount;
      const productTypeViews = allProductTypeViews[product.type] || 0;

      const discountMultiplier = calculateDiscountMultiplier(
        secondsSpentOnProduct,
        productViews,
        productTypeViews,
        averageStock,
        margin,
        randomlySelectedProducts,
        product
      );

      discounts.push({
        productId,
        discountMultiplier,
        productHandle: allProducts.filter((product) => {
          return product.id == productId;
        })[0].handle,
        productDiscountedPrice:
          product.variants[0].price * (1 - discountMultiplier),
        productOriginalPrice: product.variants[0].price,
      });
    } catch (e) {
      console.log(e);
    }

  }

  return discounts;
};
