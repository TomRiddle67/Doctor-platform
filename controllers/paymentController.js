const Booking = require('../models/Booking');
const { initializePayment, verifyPayment } = require('../services/paystackService');

const initializeBookingPayment = async (req, res) => {
    try {
        const { bookingId } = req.body;

        // Find booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }

        //Make sure this patient owns this booking
        if (booking.patient.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to pay for this booking',
            });
        }

        // Prevent paying for an already paid booking
        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'This booking is already paid for',
            });
        }

        //  Generate a unique reference
        const reference = `BOOKING-${bookingId}-${Date.now()}`;

        //  Call Paystack
        const payment = await initializePayment(
            req.user.email,
            booking.consultationFee,
            reference,
            { bookingId }
        );

        // Save reference on booking
        booking.paystackReference = reference;
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Payment initialized',
            paymentUrl: payment.data.authorization_url,
            reference,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const verifyBookingPayment = async (req, res) => {
    try {
        const { reference } = req.params;

        //Verify with Paystack
        const verification = await verifyPayment(reference);

        if (verification.data.status !== 'success') {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }

        // Find and update the booking
        const booking = await Booking.findOne({ paystackReference: reference });
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found for this reference',
            });
        }

        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified. Booking confirmed.',
            data: booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { initializeBookingPayment, verifyBookingPayment };