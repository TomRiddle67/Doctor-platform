const Booking = require('../models/Booking');
const DoctorProfile = require('../models/DoctorProfile');

const createBooking = async (req, res) => {
  try {
    const { doctorId, date, startTime, endTime, notes } = req.body;

    // Step 1: Find the doctor's profile
    const doctorProfile = await DoctorProfile.findById(doctorId);
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Step 2: Check for double booking
    const conflict = await Booking.findOne({
      doctor: doctorId,
      date: new Date(date),
      startTime,
      status: { $ne: 'cancelled' },
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked',
      });
    }

    // Step 3: Create the booking
    const booking = await Booking.create({
      patient: req.user._id,
      doctor: doctorId,
      date: new Date(date),
      startTime,
      endTime,
      consultationFee: doctorProfile.consultationFee,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createBooking };
