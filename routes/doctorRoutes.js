const express = require('express');
const router = express.Router();
const { createProfile, getAllDoctors } = require('../controllers/doctorController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', getAllDoctors);
router.post('/profile', protect, authorizeRoles('doctor'), createProfile);

module.exports = router;

