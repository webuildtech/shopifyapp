// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import GDPRWebhookHandlers from "./gdpr.js";
import mongoose from "mongoose";
import { initAuthenticatedRoutes, initPublicRoutes } from "./api/index.js";
import createWebPixel from "./helpers/pixel/web-pixel-create.js";
import { syncOrders, syncProducts, syncShop } from "./helpers/sync.js";
import { createAppDiscount } from "./helpers/discounts.js";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || "8081");

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const INDEX_PATH = `${process.cwd()}/index.html`;

const app = express();

const setupStore = async (shop) => {
  try {
    const sessions = await shopify.config.sessionStorage.findSessionsByShop(
      shop
    );
    if (sessions.length > 0) {
       console.log("Syncing products");
       await syncProducts(sessions[0]);
      console.log("Syncing orders");
      await syncOrders(sessions[0]);
      console.log("Creating web pixel");
      await createWebPixel(sessions[0], sessions[0].shop, process.env.HOST);
      console.log("Syncing shop settings");
      await syncShop(sessions[0]);
    }
  } catch (e) {
    console.log(e);
    console.log("Error: couldn't setup store");
  }
};

const testDiscount = async (shop) => {
  const sessions = await shopify.config.sessionStorage.findSessionsByShop(shop);
  if (sessions.length > 0) {
    const session = sessions[0];
    createAppDiscount(session);
  }
};

//testDiscount("ai-upsello-dev.myshopify.com");


setupStore("ai-upsello-dev.myshopify.com");

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  (req, res, next) => {
    const session = res.locals.shopify.session;

    if (session?.shop) {
      setupStore(session?.shop);
    }
    next();
  },
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

app.use(express.json());
app.use(express.text());

initPublicRoutes(app);


// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

initAuthenticatedRoutes(app);

app.use(serveStatic(STATIC_PATH, { index: false }));

/*
app.get(
  "/",
  (req, res) => {
    if (req?.query?.shop === undefined || req?.query?.shop === "undefined" || req?.query?.shop === "" || req?.query?.shop === null || !req?.query?.shop) {
      return res.sendFile(INDEX_PATH);
    } else {
      return res
      .status(200)
      .set("Content-Type", "text/html")
      .send(readFileSync(join(STATIC_PATH, "index.html")));
    }
  },
  shopify.ensureInstalledOnShop()
);
*/

app.use("/*", shopify.ensureInstalledOnShop(), async (req, res, next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);

mongoose.connect(
  "mongodb+srv://edvinaskilbauskas:tgmodb2672@cluster0.nhwymzx.mongodb.net",
  {
    dbName: "product-sales-booster",
  }
);

//runTests();
