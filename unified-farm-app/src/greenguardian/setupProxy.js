const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // We're not using the proxy anymore since we're using direct URL
  // But keeping this in case we need to switch back
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );
};
