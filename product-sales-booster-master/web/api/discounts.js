import Event from "../db/models/Event.js";
import Product from "../db/models/Product.js";
import { getOfflineSession } from "../shopify.js";
import {
  createDiscount,
  getCalculatedDiscounts,
  createAppDiscount,
} from "../helpers/discounts.js";


export default {
  get: async (req, res) => {
    const { clientId, shop, productHandles } = req.query;
      
    const products = await Product.find({
      shop,
      handle: { $in: productHandles },
    });

    const productIds = products.map((product) => product.id);
    const discounts = await getCalculatedDiscounts(clientId, productIds, shop);

    res.json({
      discounts,
    });
  },
  post: async (req, res) => {
    const { clientId, shop, productIds, cartItems } = req.query;
    const itemsJson = JSON.parse(cartItems);
    const gidProductIds = productIds.map(
      (id) => `gid://shopify/Product/${id}`
    );
    const session = await getOfflineSession(shop);

    if (!session) {
      res.sendStatus(500);
      return;
    }
    // SUTVARKYK BUTINAI KAD 'gid://shopify/Product/' butu pries id VISUR
    const discounts = await getCalculatedDiscounts(
      clientId,
      gidProductIds,
      shop
    );

    let discountSum = 0;
    const discountInfos = [];
    for (const item of itemsJson) {
      const productId = `gid://shopify/Product/${item.product_id}`;
      const variantId = `gid://shopify/ProductVariant/${item.variant_id}`;
      const product = await Product.findOne({
        shop,
        id: productId,
      });
      const variant = product.variants.find(
        (variant) => variant.id == variantId
      );

      const discountProduct = discounts.find(
        (discount) => discount.productId == productId
      );

      if (discountProduct) {
        const discountValue =
          (discountProduct.discountMultiplier * variant.price * item.quantity);
        discountSum += discountValue;

        discountInfos.push({
          productId: item.product_id.toString(),
          variantId: item.variant_id.toString(),
          discountValue,
        });
      }


    }

    const discountCode = await createAppDiscount(session, discountInfos);
    
    /*const discountCode = await createDiscount(session, {
        productIds: discountedIds,
        discountValue: discountSum,
        title: "AIUpsello discount (Do not delete)",
      });*/

    res.json({
      discountCodes: [
        discountCode
      ]
    });
  },
};
