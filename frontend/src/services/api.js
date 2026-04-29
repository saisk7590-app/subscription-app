const wait = (value) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), 150);
  });

const api = {
  async getSubscriptions() {
    return wait([]);
  },
  async createSubscription(payload) {
    return wait(payload);
  },
};

export default api;
