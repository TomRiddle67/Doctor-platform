const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('patient'), createBooking);

module.exports = router;
