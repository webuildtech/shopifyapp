import shopify from "../../shopify.js";

const updateWebPixel = async (session, shop, host, id) => {
  const client = new shopify.api.clients.Graphql({
    session,
  });
  const mutation = `mutation webPixelUpdate($id: ID!, $webPixel: WebPixelInput!) {
  webPixelUpdate(id: $id, webPixel: $webPixel) {
    userErrors {
      field
      message
    }
    webPixel {
      # WebPixel fields
      id
      settings 
    }
  }
}`;

  const res = await client.query({
    data: { query: mutation, variables: { id: id, webPixel: { settings: JSON.stringify({ host: host, shop: shop }) } } },
  });
  console.log(res);
  console.log(res.body.data.webPixelUpdate);
  console.log(res.body.data.webPixelUpdate?.userErrors);
  if (res.body.data.webPixelUpdate.webPixel == null) {
    return undefined;
  } else {
    return res.body.data.webPixelUpdate.webPixel;
  }
};

export default updateWebPixel;
