import * as API from "./api";
import {
  replaceCurrency,
  getStringBetween,
  getProductHandleFromURL,
  parseCurrencyValue,
} from "./lib";

export const constructDiscountHTML = ({
  formattedPrice,
  formattedDiscountPrice,
  percentage,
}) => {
  return `
    <div class="aiupsello-discount">
      <span class="aiupsello-discount__original-price">
        ${formattedPrice}
      </span>
      <span class="aiupsello-discount__discounted-price">
        ${formattedDiscountPrice}
      </span>
      <span class="aiupsello-discount__percentage">
        -${percentage}%
      </span>
    </div>
  `;
};

export const constructPriceHTML = (formattedPrice) => {
  return `
    <div class="aiupsello-discount">
      ${formattedPrice}
    </div>
  `;
};

export const getDiscountHTML = (originalCurrency, discount, quantity) => {
  const originalPrice = parseCurrencyValue(originalCurrency);

  const newDiscountedPrice = replaceCurrency(
    originalCurrency,
    originalPrice * (1 - discount.discountMultiplier) * quantity
  );

  const newOriginalPrice = replaceCurrency(
    originalCurrency,
    originalPrice * quantity
  );

  if (discount.productDiscountedPrice !== discount.productOriginalPrice) {
    return constructDiscountHTML({
      formattedPrice: newOriginalPrice,
      formattedDiscountPrice: newDiscountedPrice,
      percentage: (discount.discountMultiplier * 100).toFixed(0),
    });
  } else {
    return constructPriceHTML(newOriginalPrice);
  }
};

const isPriceElementDiscounted = (priceElement) => {
  return (
    priceElement.getAttribute("data-discounted") === "true" ||
    priceElement.getAttribute("data-loading") === "true"
  );
};

export const getAllProductPriceElements = (theme) => {
  // priceElement should contain:
  // - original price string
  // - price element
  // - product handle
  const priceElements = [];

  const productPriceElements = document.querySelectorAll(
    theme.selectors.product.priceContainer
  );

  productPriceElements.forEach((element) => {
    if (isPriceElementDiscounted(element)) {
      return;
    }
    const priceString = element
      .querySelector(theme.selectors.product.priceInner)
      .innerHTML.trim();
    const productHandle = AIUpsello.config.product.handle;

    if (priceString !== "") {
      priceElements.push({
        priceString,
        element,
        productHandle,
        quantity: 1,
      });
    }
  });

  const cartPriceElements = document.querySelectorAll(
    theme.selectors.cart.priceContainer
  );

  cartPriceElements.forEach((element) => {
    if (isPriceElementDiscounted(element)) {
      return;
    }
    const priceString = element
      .querySelector(theme.selectors.cart.priceInner)
      .innerHTML.trim();

    const productLink = element
      .closest(theme.selectors.cart.item)
      .querySelector("a[href*='/products/']").href;

    const productHandle = getProductHandleFromURL(productLink);

    if (priceString !== "") {
      priceElements.push({
        priceString,
        element,
        productHandle,
        quantity: 1,
      });
    }
  });

  const gridPriceElements = document.querySelectorAll(
    theme.selectors.grid.priceContainer
  );

  gridPriceElements.forEach((element) => {
    if (isPriceElementDiscounted(element)) {
      return;
    }

    // .price-item--regular is price inside .price
    const priceString = $(element)
      .find(theme.selectors.grid.priceInner)
      .html()
      .trim();
    console.log(element.closest(theme.selectors.grid.item));
    const productLink = element
      .closest(theme.selectors.grid.item)
      .querySelector("a[href*='/products/']").href;

    const productHandle = getProductHandleFromURL(productLink);

    if (priceString !== "") {
      priceElements.push({
        priceString,
        element,
        productHandle,
        quantity: 1,
      });
    }
  });

  return priceElements;
};

export const getSpinnerHTML = (color) => {
  return `<div class="lds-spinner" style>${"<div></div>".repeat(12)}</div>`;
};

export const getAllHandlesOnPage = (theme) => {
  const productHandles = [];
  const items = document.querySelectorAll(
    `${theme.selectors.grid.item} a[href*='/products/']`
  );

  items.forEach((element) => {
    const href = element.getAttribute("href");
    const handle = getProductHandleFromURL(href);
    productHandles.push(handle);
  });

  if (AIUpsello.config.template.includes("product")) {
    productHandles.push(`${AIUpsello.config.product.handle}`);
  }

  if (AIUpsello.config.template.includes("cart")) {
    AIUpsello.config.cart.items.forEach((item) => {
      productHandles.push(`${item.handle}`);
    });
  }

  return productHandles;
};
