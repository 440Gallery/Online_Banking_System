import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Account',
    },
    type: {
      type: String,
      required: true,
      enum: ['Deposit', 'Withdrawal', 'Transfer'],
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Completed',
    },
    senderAccount: {
      type: String, // Store account number for context
      required: function () {
        return this.type === 'Transfer';
      },
    },
    receiverAccount: {
      type: String, // Store account number for context
      required: function () {
        return this.type === 'Transfer';
      },
    },
    balanceAfterTransaction: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
