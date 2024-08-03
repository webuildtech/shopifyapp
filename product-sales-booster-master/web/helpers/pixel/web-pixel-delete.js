import shopify from '../../shopify.js';

const deleteWebPixel = async (session, shop, host, id) => {
  const client = new shopify.api.clients.Graphql({
    session
  });
  const mutation = `mutation {
    webPixelDelete(id: "${id}") {
      userErrors {
        code
        field
        message
      }
      webPixel {
        settings
        id
      }
    }
  }`;

  const res = await client.query({ data: { query: mutation } })

  if(res.body.data.webPixelUpdate.webPixel == null){
    return undefined;
  }else{
    return res.body.data.webPixelUpdate.webPixel;
  }
};

export default updateWebPixel;
