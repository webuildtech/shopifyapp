import shopify from '../../shopify.js';

const getWebPixel = async (session, id) => {
  const client = new shopify.api.clients.Graphql({
    session
  });
  const query = `query {
    webPixel(id: "${id}") {
      id
    }
  }`;

  const res = await client.query({ data: { query: query } });
  console.log(res);
  return res.body.data;
};

export default getWebPixel;
