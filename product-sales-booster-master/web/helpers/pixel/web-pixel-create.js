import shopify from '../../shopify.js';

const createWebPixel = async (session, shop, host) => {
  try{
  const client = new shopify.api.clients.Graphql({
    session
  });
  const mutation = `mutation {
    webPixelCreate(webPixel: { settings: {shop:"${shop}",host:"${host}"} }) {
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
  console.log(res.body.data.webPixelCreate);
  if(res.body.data.webPixelCreate.webPixel !== null) {
    return res.body.data.webPixelCreate.webPixel.id;
  }else{
    return null;
  }
  } catch (e) {
    console.log(e);
  console.log("Pixel wasn't created");
  return null;
}
  
};


export default createWebPixel;
