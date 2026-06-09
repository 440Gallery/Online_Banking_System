import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    dob: {
      type: Date,
      required: [true, 'Please add Date of Birth'],
    },
    panNumber: {
      type: String,
      required: [true, 'Please add PAN number'],
      unique: true,
    },
    aadhaarNumber: {
      type: String,
      required: [true, 'Please add Aadhaar number'],
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: false, // Optional as it's not in the new design, or keep it if we want
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    fathersName: { type: String, required: true },
    gender: { type: String, required: true },
    maritalStatus: { type: String, required: true },
    religion: { type: String, required: true },
    category: { type: String, required: true },
    income: { type: String, required: true },
    educationalQualification: { type: String, required: true },
    occupation: { type: String, required: true },
    seniorCitizen: { type: Boolean, required: true, default: false },
    existingAccount: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
