import Event from "../db/models/Event.js";
import Product from "../db/models/Product.js";
import { getOfflineSession } from "../shopify.js";

export default {
  get: async (req, res) => {

  },
  put: async (req, res) => {
    const { productId, margin } = req.query;
    const shop = res.locals.shopify.session.shop;
    
    await Product.updateOne({
      id: productId,
      shop,
    }, {
      margin,
    });

    res.json({
      success: true,
    });
  },
};


