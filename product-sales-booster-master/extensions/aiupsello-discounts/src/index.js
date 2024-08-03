// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";
/**
 * @typedef {import("../generated/api").InputQuery} InputQuery
 * @typedef {import("../generated/api").FunctionResult} FunctionResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 * @typedef {import("../generated/api").Discount} Discount
 * @typedef {import("../generated/api").Value} Value
 * @typedef {import("../generated/api").FixedAmount} FixedAmount
 */
/**
 * @type {FunctionResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};
export default /**
 * @param {InputQuery} input
 * @returns {FunctionResult}
 */
(input) => {
  // Define a type for your configuration, and parse it from the metafield
  // Its an array of objects, each object has a productId and a discountValue
  /**
   * @type {Array<{productId: string, discountValue: number, variantId: string}>}
   */
  const configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );
  if (!configuration) {
    return EMPTY_DISCOUNT;
  }

  const productIds = configuration.map((discount) => `gid://shopify/Product/${discount.productId}`);

  const targets = input.cart.lines
    // Use the configured quantity instead of a hardcoded value
    .filter(
      (line) =>
        //line.quantity >= configuration.quantity &&
        line.merchandise.__typename == "ProductVariant" &&
        productIds.includes(
          line.merchandise.product.id
        )
    )
    .map((line) => {
      const variant = /** @type {ProductVariant} */ (line.merchandise);
      return /** @type {Target} */ ({
        productVariant: {
          id: variant.id,
        },
      });
    });

  if (!targets.length) {
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  const discounts = configuration.map((discount) => {
    return {
      targets: [
        {
          productVariant: {
            id: `gid://shopify/ProductVariant/${discount.variantId}`
          },
        },
      ],
      message: "Personal Discount",
      value: {
        fixedAmount: {
          // Use the configured percentage instead of a hardcoded value
          amount: discount.discountValue,
          appliesToEachItem: false
        },
      },
    };
  });


  return {
    discounts: [discounts[0]],
    discountApplicationStrategy: DiscountApplicationStrategy.First
  };
};
