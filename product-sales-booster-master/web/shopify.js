import { BillingInterval, LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { MongoDBSessionStorage } from "@shopify/shopify-app-session-storage-mongodb";
let { restResources } = await import(
  `@shopify/shopify-api/rest/admin/${LATEST_API_VERSION}`
);


// If you want IntelliSense for the rest resources, you should import them directly
// import { restResources } from "@shopify/shopify-api/rest/admin/2022-10";

const DB_PATH = `${process.cwd()}/database.sqlite`;     

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const billingConfig = {
  "Product Sales Booster One-Time Charge": {
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    amount: 5.0,
    currencyCode: "USD",
    interval: BillingInterval.OneTime,
  },
};


const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: undefined, // or replace with billingConfig above to enable example billing
    scopes: ["write_pixels", "read_customer_events", "read_orders", "read_customers", "write_customers", "read_products", "write_price_rules", "write_discounts", "write_checkouts", "read_checkouts"],
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },

  // This should be replaced with your preferred storage strategy
  sessionStorage: new MongoDBSessionStorage("mongodb+srv://edvinaskilbauskas:tgmodb2672@cluster0.nhwymzx.mongodb.net", "product-sales-booster"),
});

export async function getOfflineSession(shop) { 
  const sessions = await shopify.config.sessionStorage.findSessionsByShop(shop);
  if (sessions.length > 0) {
    return sessions[0];
  }
  return null;
}

export default shopify;
