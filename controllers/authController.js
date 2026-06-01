const User = require("../models/User");
const jwt = require('jsonwebtoken');
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
// login

const login = async (req, res) => {
	try {
		const {email, password} = req.body;
	// find user by email
		const user = await User.findOne({email});
		if(!user) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password',
});
}
	// check if password match
		const isMatch = await user.matchPassword(password);
		if (!isMatch) {
			return res.status(401).json ({
				success: false,
				message: 'Invalid email or password',
});
}
	// Generate jwt token
		const token = jwt.sign(
			{id: user._id, role: user.role},
			process.env.JWT_SECRET,
			{expiresIn: '7d'}
);
	// send response
		res.status(200).json({
			success: true,
			message: 'Login successful',
			token,
			data: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
},
});
}		catch(error) {
			res.status(500).json({
				success: false,
				message: error.message,
});
}
};

module.exports = { register, login };
