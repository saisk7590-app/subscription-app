function getSubscriptions(_req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      data: [],
      message: 'Subscriptions endpoint is ready for implementation.',
    })
  );
}

module.exports = {
  getSubscriptions,
};
