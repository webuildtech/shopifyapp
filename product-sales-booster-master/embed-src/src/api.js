import { getClientId } from "./lib";

// if cart has discounted product, return only that product
// else, return all products
export const getDiscountedProducts = async (productHandles) => {
  const clientId = getClientId();

  const res = await fetch(
    `/apps/api/discounts?clientId=${clientId}&productHandles[]=${productHandles.join(
      "&productHandles[]="
      )}`,
    {
      method: "GET",
    }
  );
  const json = await res.json();

  return json.discounts;
};

export const addToCart = async function (variantId, quantity) {
  const res = await fetch("/cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          quantity,
          id: variantId,
        },
      ],
    }),
  });

  const json = await res.json();

  return json;
};

const getCurrentProductInfo = function () {
  const variantId = document.querySelector(
    '[name="id"][type="hidden"][value]'
  )?.value;

  if (!variantId) {
    return null;
  }

  let quantity = document.querySelector(
    '[name="quantity"][type="number"]'
  )?.value;

  if (!quantity) {
    quantity = 1;
  }

  const variantPrice = AIUpsello?.config?.product?.variants?.find(
    (variant) => variant.id == variantId
  )?.price;


  const productId = AIUpsello?.config?.product?.id;

  return {
    variantId,
    quantity,
    productId,
    variantPrice,
  };
};

const getCartDiscountCodes = async function (productIds) {
  const cart = await fetch("/cart.js");
  const cartJson = await cart.json();

  const res = await fetch(
    `/apps/api/discounts?clientId=${getClientId()}&productIds[]=` +
      productIds.join("&productIds[]=") +
      "&cartItems=" +
      JSON.stringify(cartJson.items),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const { discountCodes } = await res.json();

  return discountCodes;
};

const getProductDiscountCode = async function (productId) {
  const currentProductPageInfo = getCurrentProductInfo();

  const productLineItem = {
    product_id: productId,
    price: currentProductPageInfo.variantPrice,
    quantity: 1,
    variant_id: currentProductPageInfo.variantId,
  };

  const res = await fetch(
    `/apps/api/discounts?clientId=${getClientId()}&productIds[]=${productId}&cartItems=${JSON.stringify(
      [productLineItem]
    )}`,
    {
      method: "POST",
    }
  );
  const json = await res.json();

  console.log(json.discountCodes[0]);

  return json.discountCodes[0];
};

const buildQuickbuyCheckoutUrl = function (variantId, quantity, discountCode) {
  const checkoutUrl = `/cart/${variantId}:${quantity}?discount=${discountCode}`;

  return checkoutUrl;
};

const getCartProducts = async function () {
  const cart = await fetch("/cart.js");
  const cartJson = await cart.json();

  return cartJson.items.map((item) => ({
    variantId: item.variant_id,
    quantity: item.quantity,
    productId: item.product_id,
    handle: item.handle,
  }));
};

export const getCartSubtotal = async function () {
  const cart = await fetch("/cart.js");
  const cartJson = await cart.json();
  const cartHandles = cartJson.items.map((item) => item.handle);
  const discountedProducts = await getDiscountedProducts(cartHandles);

  let subtotal = 0;
  for (let item of cartJson.items) {
    const discountedProduct = discountedProducts.find(
      (product) => product.productHandle === item.handle
    );

    if (discountedProduct) {
      subtotal +=
        (item.original_line_price / 100) * (1 - discountedProduct.discountMultiplier);
    }

    if (!discountedProduct) {
      subtotal += item.original_line_price / 100;
    }
  }

  return subtotal;
};

export const applyDiscounts = async function ({ isBuyItNow }) {
  const cartEmpty = AIUpsello.config.cart.items.length === 0;
  if (cartEmpty && !isBuyItNow) {
    return;
  }

  if (isBuyItNow) {
    const currentProduct = getCurrentProductInfo();
    const currentProductDiscountCode = await getProductDiscountCode(
      currentProduct.productId
    );
    const checkoutUrl = buildQuickbuyCheckoutUrl(
      currentProduct.variantId,
      currentProduct.quantity,
      currentProductDiscountCode
    );

    window.location.href = checkoutUrl;
  }

  if (!cartEmpty && !isBuyItNow) {
    const cartProducts = await getCartProducts();
    const cartProductIds = cartProducts.map((item) => item.productId);
    const cartDiscountCodes = await getCartDiscountCodes(cartProductIds);

    await applyDiscountCodes(cartProducts, cartDiscountCodes);

    //await applyDiscountCode(cartDiscountCodes);

    //window.location.href = `/checkout`;
  }
};

//
export const applyDiscountCodes = async function (products, discounts) {
  let variantsUrlPart = products
    .map((item) => `${item.variantId}:${item.quantity}`)
    .join(",");

  const discountUrlPart = discounts.join(",");

  console.log(`/cart/${variantsUrlPart}?discount=${discountUrlPart}`);

  await $.ajax({
    url: `/cart/${variantsUrlPart}?discount=${discountUrlPart}`,
    success: async function (data) {
      console.log("Discounts applied");
      window.location.href = `/checkout`;
    },
  });
};
