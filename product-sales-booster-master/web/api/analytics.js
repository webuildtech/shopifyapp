import Event from '../db/models/Event.js';
import Product from '../db/models/Product.js';
import {
  getTotalSessions,
  getTopViewedProducts,
  getBounceRateProducts,
  getAttributedOrdersCount,
} from "../helpers/analytics.js";

export default {
  post: async (req, res) => {
    const event = JSON.parse(req.body);

    const productId = `gid://shopify/Product/${event.data.productVariant?.product.id}`;
    
    const existingProduct = await Product.findOne({
      id: productId,
    });

    if(!existingProduct){
      res.sendStatus(200);
      return;
    }
    

    const formattedEvent = {
      shop: req.query.shop,
      eventName: event.name,
      sessionId: event.sessionId,
      timestamp: event.timestamp,
      pageTitle: event.context.document.title,
      referrer: {
        href: event.context.document.referrer
      },
      url: {
        href: event.context.document.location.href,
        host: event.context.document.location.host,
        hostname: event.context.document.location.hostname,
        origin: event.context.document.location.origin,
        pathname: event.context.document.location.pathname,
        search: event.context.document.location.search,
      },
      clientId: event.clientId,
      language: event.context.navigator.language,
      product: existingProduct
    };

    await Event.create(formattedEvent);
    res.sendStatus(200);
  },
  get: async (req, res) => {
    const shop = res.locals.shopify.session.shop;
    const totalSessions = await getTotalSessions(shop);
    const topViewedProducts = await getTopViewedProducts(shop);
    const topBounceRateProducts = await getBounceRateProducts(shop, "desc", 10);
    const topLowestBounceRateProducts = await getBounceRateProducts(shop, "asc", 10);
    const attributedOrdersCount = await getAttributedOrdersCount(shop);

    res.json({
      totalSessions,
      topViewedProducts,
      topBounceRateProducts,
      topLowestBounceRateProducts,
      attributedOrdersCount,
    });
  },
};

