import User from '../models/User.js';
import Account from '../models/Account.js';
import generateToken from '../utils/generateToken.js';
import { generateAccountNumber } from '../utils/generateAccountNumber.js';

// @desc    Register a new user & create account
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { 
      fullName, email, password, dob, panNumber, aadhaarNumber, phoneNumber, address,
      city, state, pinCode, fathersName, gender, maritalStatus, religion, category,
      income, educationalQualification, occupation, seniorCitizen, existingAccount,
      accountType
    } = req.body;

    // Check if user exists (by email, PAN or Aadhaar)
    const userExists = await User.findOne({
      $or: [{ email }, { panNumber }, { aadhaarNumber }],
    });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email, PAN or Aadhaar');
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      password,
      dob,
      panNumber,
      aadhaarNumber,
      phoneNumber,
      address,
      city,
      state,
      pinCode,
      fathersName,
      gender,
      maritalStatus,
      religion,
      category,
      income,
      educationalQualification,
      occupation,
      seniorCitizen: seniorCitizen === 'Yes',
      existingAccount: existingAccount === 'Yes'
    });

    if (user) {
      // Auto-create Bank Account
      let accNumber;
      let accountExists = true;
      while (accountExists) {
        accNumber = generateAccountNumber();
        const existing = await Account.findOne({ accountNumber: accNumber });
        if (!existing) {
          accountExists = false;
        }
      }

      const account = await Account.create({
        user: user._id,
        accountNumber: accNumber,
        accountType: accountType === 'Current Account' ? 'Current' : 'Savings',
        balance: 0,
      });

      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountNumber: account.accountNumber,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email, select password since we set select: false in schema
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const account = await Account.findOne({ user: user._id });
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountNumber: account ? account.accountNumber : null,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const account = await Account.findOne({ user: req.user._id });

    if (user && account) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        dob: user.dob,
        panNumber: user.panNumber,
        aadhaarNumber: user.aadhaarNumber,
        phoneNumber: user.phoneNumber,
        address: user.address,
        account: {
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          balance: account.balance,
        }
      });
    } else {
      res.status(404);
      throw new Error('User or Account not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.address = req.body.address || user.address;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const account = await Account.findOne({ user: updatedUser._id });

      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        account: account ? {
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          balance: account.balance,
        } : null,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/profile
// @access  Private
export const deleteUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const account = await Account.findOne({ user: req.user._id });
      if (account && account.balance > 0) {
        res.status(400);
        throw new Error('Cannot delete account with a non-zero balance. Please withdraw or transfer your funds first.');
      }

      await Account.deleteOne({ user: req.user._id });
      await User.deleteOne({ _id: req.user._id });
      
      res.json({ message: 'User and account removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
