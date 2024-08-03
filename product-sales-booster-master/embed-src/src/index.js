import { excecuteOnMutation, replaceCurrency } from "./lib";
import {
  addSpinner,
  applyCartPageDiscounts,
  applyProductPageDiscount,
  applyGridDiscounts,
  getAllHandlesOnPage,
  getAllProductPriceElements,
  getSpinnerHTML,
  getDiscountHTML,
  constructPriceHTML,
} from "./theme";
import * as API from "./api";
import currency from "currency.js";
import dawn from "./themes/dawn.js";
import electro from "./themes/electro";

  $("#checkout, #CartDrawer-Checkout").click(async function (e) {
    e.preventDefault();
    $(this).attr("type", "button");
    addSpinnerInside($(this));
    API.applyDiscounts({
      isBuyItNow: false,
    });
  });


window.addEventListener("load", async () => {
  console.log("AI Upsello - Initialized");

  $(".shopify-payment-button *, .shopify-payment-button").click(async function (
    e
  ) {
    addSpinnerInside($(".shopify-payment-button__button"));
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.cancelBubble = true;
    e.returnValue = false;

    setTimeout(() => {
      API.applyDiscounts({
        isBuyItNow: true,
      });
    }, 1000);
  });

  $(".shopify-payment-button *").css("pointer-events", "none");
  $(".shopify-payment-button").css("cursor", "pointer");
});


const addSpinnersToAllProductPriceElements = (productPrices) => {
  productPrices.forEach(({ element }) => {
    $(element).html(getSpinnerHTML());
    $(element).attr("data-loading", "true");
  });

  $(dawn.selectors.cart.subtotal).html(getSpinnerHTML());
  $(dawn.selectors.cart.subtotal).attr("data-loading", "true");
};

const addSpinnerInside = (element) => {
  $(element).html(getSpinnerHTML());
};

const recalculateVisualDiscounts = async (productPrices) => {
  const discounts = await API.getDiscountedProducts(getAllHandlesOnPage(dawn));

  productPrices.forEach(({ productHandle, priceString, element, quantity }) => {
    const discount = discounts.find(
      (discount) => discount.productHandle === productHandle
    );

    if (discount) {
      $(element).html(getDiscountHTML(priceString, discount, quantity));
      $(element).attr("data-discounted", "true");
      $(element).attr("data-loading", "false");
    }
  });
};

const recalculateCartSubtotal = async (oldSubtotal) => {
  const subtotal = await API.getCartSubtotal();
  const newSubtotalText = replaceCurrency(oldSubtotal, subtotal);
  const subtotalElement = $(dawn.selectors.cart.subtotal);
  
  if (subtotalElement.length > 0) {
    subtotalElement.html(constructPriceHTML(newSubtotalText));
    subtotalElement.attr("data-discounted", "true");
    subtotalElement.attr("data-loading", "false");
  }
}


excecuteOnMutation(async () => {
  const productPrices = getAllProductPriceElements(dawn);
  const cartSubtotal = $(dawn.selectors.cart.subtotal).text();

  console.log("AI Upsello - Mutation detected");
  addSpinnersToAllProductPriceElements(productPrices);

  recalculateCartSubtotal(cartSubtotal);
  recalculateVisualDiscounts(productPrices);
}, ".product-grid, .cart-items, .price, .product");

const productPrices = getAllProductPriceElements(dawn);
const cartSubtotal = $(dawn.selectors.cart.subtotal).text();

addSpinnersToAllProductPriceElements(productPrices);

recalculateCartSubtotal(cartSubtotal);
recalculateVisualDiscounts(productPrices);

window.addEventListener("load", async () => {
  await recalculateVisualDiscounts(productPrices);
});
