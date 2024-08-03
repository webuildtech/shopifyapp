import Product from "../db/models/Product.js";
import Order from "../db/models/Order.js";
import shopify from "../shopify.js";
import { getOrders } from "./orders.js";
import { getShopData } from "./shop.js";

import { getProductsFromShopify } from "./product.js";
import { get } from "mongoose";
import Shop from "../db/models/Shop.js";

const getProductGid = (productId) => {
  if (productId.toString().startsWith("gid://shopify/Product/")) {
    return productId.toString();
  } else {
    return "gid://shopify/Product/" + productId;
  }
};

const getOrderGid = (orderId) => {
  if (orderId.toString().startsWith("gid://shopify/Order/")) {
    return orderId.toString();
  } else {
    return "gid://shopify/Order/" + orderId;
  }
};

const getVariantGid = (variantId) => {
  if (variantId.toString().startsWith("gid://shopify/ProductVariant/")) {
    return variantId.toString();
  } else {
    return "gid://shopify/ProductVariant/" + variantId;
  }
};

const getShopGid = (shopId) => {
  if (shopId.toString().startsWith("gid://shopify/Shop/")) {
    return shopId.toString();
  } else {
    return "gid://shopify/Shop/" + shopId;
  }
};

const constructDbProduct = (shopifyProduct, dbProduct, session, shop) => {
  return {
    id: getProductGid(shopifyProduct.id),
    title: shopifyProduct.title,
    vendor: shopifyProduct.vendor,
    type: shopifyProduct.product_type,
    handle: shopifyProduct.handle,
    shop: session.shop,
    margin: dbProduct?.margin || 1,
    selectedAsRandom: Math.random() < 0.1, // 10% chance of being selected
    variants: shopifyProduct.variants.map((variant) => {
      return {
        id: getVariantGid(variant.id),
        productId: getProductGid(shopifyProduct.id),
        title: variant.title,
        price: variant.price,
        imageSrc: variant.imageSrc,
        inventoryQuantity: variant.inventoryQuantity,
        currencyCode: shop.currency,
      };
    }),
  };
};

const constructDbOrder = async (shopifyOrder) => {
  const variantIds = shopifyOrder.lineItems.map(
    (lineItem) => lineItem?.variant?.id
  );
  const productIds = shopifyOrder.lineItems.map(
    (lineItem) => lineItem?.product?.id
  );
  const products = await Product.find({ id: { $in: productIds } });
  const variants = products
    .flatMap((product) => product.variants)
    .filter((variant) => variantIds.includes(variant.id));
  return {
    id: getOrderGid(shopifyOrder.id),
    name: shopifyOrder.name,
    discountCodes: shopifyOrder.discountCodes,
    price: {
      amount: shopifyOrder.currentSubtotalPriceSet.shopMoney.amount,
      currencyCode: shopifyOrder.currentSubtotalPriceSet.shopMoney.currencyCode,
    },
    lineItems: shopifyOrder.lineItems.map((lineItem) => {
      const variant = variants.find(
        (variant) => variant.id === lineItem.variant.id
      );
      const product = products.find(
        (product) => product.id === lineItem.product.id
      );
      return {
        id: lineItem.id,
        quantity: lineItem.quantity,
        variant,
        product,
      };
    }),
  };
};

export const syncOrders = async (session) => {
  let lastCursor = null;
  while (true) {
    const { hasNextPage, cursor, orders } = await getOrders(
      session,
      lastCursor
    );
    lastCursor = cursor;
    for (let order of orders) {
      const existingOrder = await Order.findOne({ id: getOrderGid(order.id) });

      const constructedOrder = await constructDbOrder(order);
      constructedOrder.shop = session.shop;

      if (!existingOrder) {
        const newOrder = new Order(constructedOrder);
        await newOrder.save();
      } else {
        await Order.updateOne(
          { id: getOrderGid(order.id) },
          {
            $set: {
              ...constructedOrder,
            },
          }
        );
      }
    }

    if (!hasNextPage) {
      break;
    }
  }
};

export const syncProducts = async (session) => {
  const shopData = await getShopData(session);
  let lastCursor = null;

  while (true) {
    const { hasNextPage, cursor, products } = await getProductsFromShopify(
      session,
      lastCursor
    );
    lastCursor = cursor;
    for (let product of products) {
      const existingProduct = await Product.findOne({ id: getProductGid(product.id) });

      const constructedProduct = constructDbProduct(
        product,
        existingProduct,
        session,
        shopData
      );
      constructedProduct.shop = session.shop;

      if (!existingProduct) {
        const newProduct = new Product(constructedProduct);
        await newProduct.save();
      } else {
        await Product.updateOne(
          { id: getProductGid(product.id) },
          {
            $set: {
              ...constructedProduct,
            },
          }
        );
      }
    }

    if (!hasNextPage) {
      break;
    }
  }
};

const constructDbShop = (shopifyShop) => {
  return {
    id: getShopGid(shopifyShop.id),
    name: shopifyShop.name,
    email: shopifyShop.email,
    domain: shopifyShop.domain,
    country: shopifyShop.country,
    countryCode: shopifyShop.country_code,
    countryName: shopifyShop.country_name,
    currency: shopifyShop.currency,
    moneyFormat: shopifyShop.money_format,
    moneyWithCurrencyFormat: shopifyShop.money_with_currency_format,
    shop: shopifyShop.myshopify_domain,
  };
};

export const syncShop = async (session) => {
  const shop = await getShopData(session);
  const existingShop = await Shop.findOne({ id: getShopGid(shop.id) });

  const constructedShop = constructDbShop(shop);

  if (!existingShop) {
    const newShop = new Shop(constructedShop);
    await newShop.save();
  } else {
    await Shop.updateOne(
      { id: getShopGid(existingShop.id) },
      {
        $set: {
          ...constructedShop,
        },
      }
    );
  }
};
