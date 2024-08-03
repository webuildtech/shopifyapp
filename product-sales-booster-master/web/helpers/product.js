import Product from "../db/models/Product.js";
import shopify from "../shopify.js";

/*
const ProductSchema = new mongoose.Schema({
  id: { type: String },
  shop: String,
  title: { type: String },
  vendor: { type: String },
  type: { type: String },
  status: { type: String },
  handle: String,
  tags: [String],
  margin: Number,
  variants: [ProductVariantSchema],
  selectedAsRandom: Boolean,
});


const ProductVariantSchema = new mongoose.Schema({
  id: { type: String, required: false, unique: false },
  productId: { type: String, required: false },
  imageSrc: { type: String},
  price: { type: Number },
  currencyCode: { type: String },
  sku: { type: String },
  title: { type: String },
  inventoryQuantity: { type: Number },
});

export default ProductVariantSchema;





*/

const getProductsQuery = (cursor) => {
  return `
    {
      products(first: 5 ${cursor ? `, after: "${cursor}"` : ""}) {
        edges {
          node {
            id
            title
            vendor
            productType
            status
            handle
            tags
            variants(first: 5) {
              edges {
                node {
                  id
                  image {
                    url
                  }
                  price
                  sku
                  title
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;
};

// get discount names as well
export const getProductsFromShopify = async (session, cursor) => {
  const client = new shopify.api.clients.Graphql({
    session,
  });

  try {
    const response = await client.query({
      data: {
        query: getProductsQuery(cursor),
      },
    });

    // extaracts orders and line items from nodes
    const products = response.body.data.products.edges.map((edge) => {
      const product = edge.node;
      const variants = product.variants.edges.map((edge) => {
        const variant = edge.node;
        return {
          id: variant.id,
          imageSrc: variant.image?.url,
          price: variant.price,
          sku: variant.sku,
          title: variant.title
        };
      });

      return {
        id: edge.node.id,
        title: edge.node.title,
        vendor: edge.node.vendor,
        type: edge.node.type,
        status: edge.node.status,
        handle: edge.node.handle,
        tags: edge.node.tags,
        variants,
      };
    });

    return {
      products,
      hasNextPage: response.body.data.products.pageInfo.hasNextPage,
      cursor: response.body.data.products.pageInfo.endCursor,
    };
  } catch (e) {
    console.log(e);
    console.log(e?.response);
  }

  return {
    products: [],
    hasNextPage: false,
    cursor: "",
  };
};

export const getAllProducts = async (shop) => {
  const products = await Product.find({
    shop,
  });

  return products;
};


export const getRandomlySelectedProducts = async (shop) => {
  const randomProducts = await Product.find({
    selectedAsRandom: true,
    shop,
  });

  return randomProducts;
};