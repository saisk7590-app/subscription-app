const { getSubscriptions } = require('../controllers/subscriptionController');

function handleSubscriptionRoutes(req, res) {
  if (req.method === 'GET') {
    getSubscriptions(req, res);
    return;
  }

  res.writeHead(405, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Method not allowed' }));
}

module.exports = {
  handleSubscriptionRoutes,
};
