import Event from "../db/models/Event.js";
import Product from "../db/models/Product.js";

export const getProductViews = async (clientId, productIds) => {
  const events = await Event.find({
    clientId,
    eventName: "product_viewed",
    "product.id": { $in: productIds },
  });

  const productViews = productIds.map((productId) => {
    const productViewCount = events.filter(
      (event) => event.product.id == productId
    ).length;

    return {
      productId,
      productViewCount,
    };
  });
  return productViews;
};

export const getProductTypeViews = async (clientId, types) => {
  const events = await Event.find({
    clientId,
    eventName: "product_viewed",
    "product.type": { $in: types },
  });

  const productTypeViews = {};

  for (const type of types) {
    const productViewCount = events.filter(
      (event) => event.product.type == type
    ).length;

    productTypeViews[type] = productViewCount;
  }

  return productTypeViews;
};

export const getAverageProductStock = async (allProducts) => {
  const averageStock =
    allProducts.reduce((acc, product) => {
      return (
        acc +
        product.variants.reduce((acc, variant) => {
          return acc + variant.inventoryQuantity;
        }, 0)
      );
    }, 0) / allProducts.length;

  return averageStock;
};

export const getProductTypes = async (productIds) => {
  const products = await Product.find({ id: { $in: productIds } });

  return products
    .map((product) => {
      return product.type;
    })
    .filter((type, index, self) => {
      return self.indexOf(type) === index;
    });
};

export const calculateDiscountMultiplier = (
  secondsSpentOnProduct,
  productViews,
  productTypeViews,
  averageStock,
  productMaxDiscountPercentage = 1,
  randomlySelectedProducts,
  product
) => {
  let discountMultiplier = 0;
  const productStock = product.variants.reduce((acc, variant) => {
    return acc + variant.inventoryQuantity;
  }, 0);

  // step 3 (complete)
  if (productViews > 2) {
    // apply discount of 50%
    discountMultiplier = 0.5 * productMaxDiscountPercentage;
  }

  // step 4 (complete)
  if (productTypeViews > 1) {
    // apply discount of 50% to random 10% of total products
    const randomProductIds = randomlySelectedProducts.map(
      (product) => product.id
    );
    if (randomProductIds.includes(product.id)) {
      discountMultiplier = 0.7 * productMaxDiscountPercentage;
    }
  }

  // step 5 (complete)
  if (secondsSpentOnProduct > 30) {
    // apply discount of 50%
    discountMultiplier = 0.5 * productMaxDiscountPercentage;
  }

  // step 6
  // TODO

  // step 7 (complete)
  if (productStock > averageStock * 1.5) {
    discountMultiplier = 0.85 * productMaxDiscountPercentage;
  }

  return discountMultiplier;
};

export const getMargins = async (allProducts) => {
  const margins = allProducts.map((product) => {
    return {
      productId: product.id,
      margin: product.margin,
    };
  });

  return margins;
};

export const getTimeSpent = async (clientId, productIds) => {
  const events = await Event.find({
    clientId,
    "product.id": { $in: productIds },
  });

  const eventsByProductId = productIds.map((productId) => {
    const productEvents = events.filter(
      (event) => event.product.id == productId
    );

    return {
      productId,
      events: productEvents,
    };
  });

  let totalTimeSpentOnProductIds = eventsByProductId.map((productEvents) => {
    let totalTimeSpentOnProduct = 0;
    const productId = productEvents.productId;
    const events = productEvents.events;

    // remove "page_view" events that have duplicate "timestamp" values
    const filteredEvents = events.filter((event, index) => {
      const eventsWithSameTimestamp = events.filter(
        (event) => event.timestamp == events[index].timestamp
      );

      if (
        eventsWithSameTimestamp.length > 1 &&
        event.eventName == "page_view"
      ) {
        return false;
      }
      return true;
    });

    for (let i = 0; i < filteredEvents.length - 1; i++) {
      const event = filteredEvents[i];
      const nextEvent = filteredEvents[i + 1];

      if (
        event.eventName == "product_viewed" &&
        event.product.id == productId
      ) {
        const productViewDate = new Date(event.timestamp);
        const productViewEndDate = new Date(nextEvent.timestamp);
        const difference = productViewEndDate - productViewDate;
        totalTimeSpentOnProduct += difference;
      }
    }

    return {
      productId,
      totalTimeSpentOnProduct,
    };
  });

  return totalTimeSpentOnProductIds;
};
