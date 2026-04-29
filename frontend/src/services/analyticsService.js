const analyticsService = {
  async getSummary() {
    return {
      totalSpend: 0,
      activeSubscriptions: 0,
      upcomingRenewals: 0,
    };
  },
};

export default analyticsService;
