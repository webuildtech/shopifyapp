import Event from "../db/models/Event.js";
import Product from "../db/models/Product.js";
import Order from "../db/models/Order.js";

// calculates how many different sessions a shop has had
// gets the total number of sessions for a shop
// each event contains a session id
// calculates the number of unique session ids
// uses aggregate function to get the number of unique sessionId's
export const getTotalSessions = async (shop) => {
  const totalSessions = await Event.aggregate([
    { $match: { shop } },
    { $group: { _id: "$sessionId" } },
    { $count: "totalSessions" },
  ]);

  return totalSessions[0]?.totalSessions ?? 0;
};

export const getTopViewedProducts = async (shop) => {
  const topViewedProducts = await Event.aggregate([
    { $match: { shop } },
    { $group: { _id: "$product.id", views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $limit: 10 },
  ]);

  const products = await Product.find({
    id: {
      $in: topViewedProducts.map((product) => product._id),
    },
  });

  const productsWithCount = products.map((product) => {
    const productWithCount = topViewedProducts.find(
      (topViewedProduct) => topViewedProduct._id === product.id
    );
    return {
      ...product.toObject(),
      views: productWithCount.views,
    };
  });

  return productsWithCount.sort((a, b) => b.views - a.views);
};

export const getBounceRateProducts = async (shop, sort, limit) => {
  // gets the top 10 products with the highest bounce rate
  // returns an array of objects with the product and the bounce rate
  // the bounce rate is calculated by the number of sessions that only viewed that product
  // events have sessionId's

  // get all events for a shop
  // group by product id
  // count the number of unique session id's
  // count the number of events for that product id
  // divide the number of unique session id's by the number of events
  // sort by the ratio of unique session id's to the number of events
  // limit to 10

  // dont return sessions in the response
  const topBounceRateProducts = await Event.aggregate([
    { $match: { shop } },
    {
      $group: {
        _id: "$product.id",
        count: { $sum: 1 },
        sessions: { $addToSet: "$sessionId" },
      },
    },
    {
      $addFields: {
        bounceRate: { $divide: [{ $size: "$sessions" }, "$count"] },
      },
    },
    { $limit: limit },
    { $project: { sessions: 0 } },
  ]);

  const products = await Product.find({
    id: {
      $in: topBounceRateProducts.map((product) => product._id),
    },
  });

  const productsWithCount = products.map((product) => {
    const productWithCount = topBounceRateProducts.find(
      (topBounceRateProduct) => topBounceRateProduct._id === product.id
    );
    return {
      ...product.toObject(),
      count: productWithCount.count,
      bounceRate: productWithCount.bounceRate * 100,
    };
  });

  return productsWithCount.sort((a, b) => {
    if (sort === "asc") {
      return a.bounceRate - b.bounceRate;
    } else {
      return b.bounceRate - a.bounceRate;
    }
  });
};

export const getAttributedOrdersCount = async (shop) => {
  const attributedOrdersCount = await Order.aggregate([
    { $match: { shop } },
    { $unwind: "$discountCodes" },
    { $match: { discountCodes: { $regex: /^aiup_/ } } },
    { $count: "attributedOrdersCount" },
  ]);
  
  return attributedOrdersCount[0]?.attributedOrdersCount ?? 0;
};
