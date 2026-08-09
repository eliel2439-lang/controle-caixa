module.exports = function handler(req, res) {
  res.status(200).json({
    ok: true,
    app: 'Gestão 360° Ultra',
    service: 'api',
    timestamp: new Date().toISOString()
  });
};
