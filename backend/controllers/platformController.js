const User = require('../models/User');

// In-memory platform store (use DB collection in production)
const platformsDB = {};

// @GET /api/platforms
exports.getPlatforms = async (req, res) => {
  const userId = req.user.id.toString();
  const platforms = platformsDB[userId] || [
    { name: 'Uber', icon: '🚗', connected: true, earnings: 28400 },
    { name: 'Swiggy', icon: '🛵', connected: true, earnings: 8200 },
    { name: 'Upwork', icon: '💼', connected: true, earnings: 12100 },
    { name: 'Ola', icon: '🟡', connected: false, earnings: 0 },
    { name: 'Zomato', icon: '🍕', connected: false, earnings: 0 }
  ];
  res.json({ success: true, data: platforms });
};

// @POST /api/platforms/connect
exports.connectPlatform = async (req, res) => {
  const { name, apiKey } = req.body;
  if (!name || !apiKey) return res.status(400).json({ success: false, message: 'Platform name and API key are required' });
  const userId = req.user.id.toString();
  if (!platformsDB[userId]) platformsDB[userId] = [];
  const existing = platformsDB[userId].find(p => p.name === name);
  if (existing) { existing.connected = true; }
  else { platformsDB[userId].push({ name, icon: '🔗', connected: true, earnings: 0 }); }
  res.json({ success: true, message: `${name} connected successfully` });
};

// @DELETE /api/platforms/:platformName
exports.disconnectPlatform = async (req, res) => {
  const userId = req.user.id.toString();
  const { platformName } = req.params;
  if (platformsDB[userId]) {
    const p = platformsDB[userId].find(x => x.name === platformName);
    if (p) p.connected = false;
  }
  res.json({ success: true, message: `${platformName} disconnected` });
};