function handleAnalyticsRoutes(_req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      data: [],
      message: 'Analytics endpoint is ready for implementation.',
    })
  );
}

module.exports = {
  handleAnalyticsRoutes,
};
