import Event from "../db/models/Event.js";
import Product from "../db/models/Product.js";
import { getOfflineSession } from "../shopify.js";

export default {
  get: async (req, res) => {
    const shop = res.locals.shopify.session.shop;
    const products = await Product.find({
      shop,
    });

    res.json(products);

  },
  put: async (req, res) => {

  },
};


