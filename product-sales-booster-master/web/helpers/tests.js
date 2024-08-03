
import shopify from "../shopify.js";




export const runTests = async () => {
  try {
    await setupStore("ed-dev-store.myshopify.com");
    await setupStore("ai-upsello-test-store.myshopify.com");
  } catch (e) {
    console.log(e);
  }
};

