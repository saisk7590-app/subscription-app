const subscriptionModel = require('../models/subscriptionModel');

function listSubscriptions() {
  return subscriptionModel.findAll();
}

module.exports = {
  listSubscriptions,
};
