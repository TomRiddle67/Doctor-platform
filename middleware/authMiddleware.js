const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
	try{
	// check if authorizaton header exists
		const authHeader = req.headers.authorization;
		if(!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({
				success: false,
				message: 'Not authorized, no token provided',
});
}
	// extract token (remove "Bearer" prefix)
		const token = authHeader.split(' ')[1];
	//verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
	//find user and attach to request
		req.user = await User.findById(decoded.id).select('-password');
	// pass to the controller function
		next();
}		catch(error) {
			return res.status(401).json({
				success: false,
				message: 'Not authorized, inavlid token',
});
}
};

module.exports = {protect};
