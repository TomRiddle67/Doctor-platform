const User = require("../models/User");
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }
    //create user
    //automatic password hashing with User model's pre('save') hook

    const user = await User.create({ name, email, password, role });
    //send response

    res.status(201).json({
      success: true,
      message: "registration successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { register };
