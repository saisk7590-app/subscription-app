const http = require('http');

const { handleSubscriptionRoutes } = require('./src/routes/subscriptionRoutes');
const { handleAnalyticsRoutes } = require('./src/routes/analyticsRoutes');

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (req.url && req.url.startsWith('/api/subscriptions')) {
    handleSubscriptionRoutes(req, res);
    return;
  }

  if (req.url && req.url.startsWith('/api/analytics')) {
    handleAnalyticsRoutes(req, res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Route not found' }));
});

server.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
