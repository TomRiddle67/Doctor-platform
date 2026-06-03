const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User,
		required: true,
		unique: true,
},
	specialization: {
		type: String,
		required: [true, 'Specialization is required'],
		trim: true,
},
	qualifications: {
		type: String,
		trim: true,
},
	experience: {
		type: Number,
		default: 0,
},
	coonsultationFee: {
		type: Number,
		default: 0,
},
	availability: [
		{
			day: {
				type: String,
				enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday', 'Sunday',],
},
			startTime: {type: String},
			endTime: {type: String},
},
],
	bio: {
		type: String,
		trim: true,
},
	isAvailble: {
		type: Boolean,
		default: true,
},
},
	{timestamps: true}
);

module.exports = mongoose.model ('DoctorProfile', doctorProfileSchema);
