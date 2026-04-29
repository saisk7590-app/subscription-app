import api from './api';

const subscriptionService = {
  getAll() {
    return api.getSubscriptions();
  },
  create(payload) {
    return api.createSubscription(payload);
  },
};

export default subscriptionService;
