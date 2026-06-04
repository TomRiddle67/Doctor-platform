const DoctorProfile = require('../models/DoctorProfile');

const createProfile = async (req, res) => {
  try {
    // Check if profile already exists for this doctor
    const existing = await DoctorProfile.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Doctor profile already exists',
      });
    }

    // Pull data from request body
    const {
      specialization,
      qualifications,
      experience,
      consultationFee,
      availability,
      bio,
    } = req.body;

    // Create profile linked to logged-in user
    const profile = await DoctorProfile.create({
      user: req.user._id,
      specialization,
      qualifications,
      experience,
      consultationFee,
      availability,
      bio,
    });

    res.status(201).json({
      success: true,
      message: 'Doctor profile created',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//getdoctors from db
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await DoctorProfile.find({ isAvailable: true })
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createProfile, getAllDoctors };
