const express = require('express');
const router = express.Router();
const { getPlatforms, connectPlatform, disconnectPlatform } = require('../controllers/platformController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getPlatforms);
router.post('/connect', protect, connectPlatform);
router.delete('/:platformName', protect, disconnectPlatform);

module.exports = router;