const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: 6,
		},
		role: {
			type: String,
			enum: ['patient', 'doctor'],
			default: 'patient',
		},
		phone: { 
			type: String,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
		{timestamps: true}
);

// hash password
userSchema.pre('save', async function () {
	if (!this.isModified('password')) return;
	this.password = await bcrypt.hash(this.password, 12);
});

//compare passwords at login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

