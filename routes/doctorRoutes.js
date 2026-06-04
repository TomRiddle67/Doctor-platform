const express = require('express');
const router = express.Router();
const { createProfile } = require('../controllers/doctorController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/profile', protect, authorizeRoles('doctor'), createProfile);

module.exports = router;

