import shopify from "../shopify.js";

export const getShopData = async (session) => {
  const client = new shopify.api.clients.Rest({
    session,
  });

  const shop = await client.get({
    path: "/admin/shop.json",
  });

  return shop.body.shop;
}
