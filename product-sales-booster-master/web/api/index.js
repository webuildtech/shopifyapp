import analytics from './analytics.js';
import discounts from './discounts.js';
import margin from './margin.js';
import products from './products.js';

export function initAuthenticatedRoutes(app) {
  app.put('/api/margins', margin.put);
  app.get('/api/products', products.get);
  app.get('/api/analytics', analytics.get);
}

export function initPublicRoutes(app) {
  app.post('/api/analytics', analytics.post);
  app.get('/api/discounts', discounts.get);
  app.post('/api/discounts', discounts.post);
}
