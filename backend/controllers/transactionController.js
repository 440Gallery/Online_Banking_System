import mongoose from 'mongoose';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';

// @desc    Deposit money
// @route   POST /api/transactions/deposit
// @access  Private
export const depositMoney = async (req, res, next) => {
  try {
    const { amount, description } = req.body;

    if (amount <= 0) {
      res.status(400);
      throw new Error('Deposit amount must be greater than zero');
    }

    const account = await Account.findOne({ user: req.user._id });
    if (!account) {
      res.status(404);
      throw new Error('Account not found');
    }

    account.balance += amount;
    await account.save();

    const transaction = await Transaction.create({
      account: account._id,
      type: 'Deposit',
      amount,
      description: description || 'Self Deposit',
      status: 'Completed',
      balanceAfterTransaction: account.balance,
    });

    res.status(200).json({
      message: 'Deposit successful',
      balance: account.balance,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw money
// @route   POST /api/transactions/withdraw
// @access  Private
export const withdrawMoney = async (req, res, next) => {
  try {
    const { amount, description } = req.body;

    if (amount <= 0) {
      res.status(400);
      throw new Error('Withdrawal amount must be greater than zero');
    }

    const account = await Account.findOne({ user: req.user._id });
    if (!account) {
      res.status(404);
      throw new Error('Account not found');
    }

    if (account.balance < amount) {
      res.status(400);
      throw new Error('Insufficient balance');
    }

    account.balance -= amount;
    await account.save();

    const transaction = await Transaction.create({
      account: account._id,
      type: 'Withdrawal',
      amount,
      description: description || 'Self Withdrawal',
      status: 'Completed',
      balanceAfterTransaction: account.balance,
    });

    res.status(200).json({
      message: 'Withdrawal successful',
      balance: account.balance,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Transfer money
// @route   POST /api/transactions/transfer
// @access  Private
export const transferMoney = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { receiverAccountNumber, amount, description } = req.body;

    if (amount <= 0) {
      throw new Error('Transfer amount must be greater than zero');
    }

    const senderAccount = await Account.findOne({ user: req.user._id }).session(session);
    if (!senderAccount) {
      throw new Error('Sender account not found');
    }

    if (senderAccount.accountNumber === receiverAccountNumber) {
      throw new Error('Cannot transfer to self');
    }

    if (senderAccount.balance < amount) {
      throw new Error('Insufficient balance');
    }

    const receiverAccount = await Account.findOne({ accountNumber: receiverAccountNumber }).session(session);
    if (!receiverAccount) {
      throw new Error('Receiver account not found');
    }

    // Perform transfer
    senderAccount.balance -= amount;
    receiverAccount.balance += amount;

    await senderAccount.save({ session });
    await receiverAccount.save({ session });

    // Create Sender Transaction Record
    const senderTx = await Transaction.create([{
      account: senderAccount._id,
      type: 'Transfer',
      amount,
      description: description || `Transfer to ${receiverAccountNumber}`,
      status: 'Completed',
      senderAccount: senderAccount.accountNumber,
      receiverAccount: receiverAccount.accountNumber,
      balanceAfterTransaction: senderAccount.balance,
    }], { session });

    // Create Receiver Transaction Record
    const receiverTx = await Transaction.create([{
      account: receiverAccount._id,
      type: 'Deposit', // From receiver's perspective, it's a deposit via transfer
      amount,
      description: `Transfer from ${senderAccount.accountNumber}`,
      status: 'Completed',
      senderAccount: senderAccount.accountNumber,
      receiverAccount: receiverAccount.accountNumber,
      balanceAfterTransaction: receiverAccount.balance,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: 'Transfer successful',
      balance: senderAccount.balance,
      transaction: senderTx[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    // Wrap the error to pass to our custom error handler properly without crashing
    res.status(400);
    next(error);
  }
};

// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res, next) => {
  try {
    const account = await Account.findOne({ user: req.user._id });
    if (!account) {
      res.status(404);
      throw new Error('Account not found');
    }

    const transactions = await Transaction.find({ account: account._id }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};
