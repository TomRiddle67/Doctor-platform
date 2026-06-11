const express = require('express');
const router = express.Router();
const { initializeBookingPayment, verifyBookingPayment } = require('../controllers/paymentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/initialize', protect, authorizeRoles('patient'), initializeBookingPayment);
router.get('/verify/:reference', protect, verifyBookingPayment);

module.exports = router;