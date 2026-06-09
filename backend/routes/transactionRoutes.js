import express from 'express';
import { body, validationResult } from 'express-validator';
import { depositMoney, withdrawMoney, transferMoney, getTransactions } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  '/deposit',
  protect,
  [
    body('amount', 'Amount must be a positive number').isNumeric().custom((value) => value > 0),
  ],
  validateRequest,
  depositMoney
);

router.post(
  '/withdraw',
  protect,
  [
    body('amount', 'Amount must be a positive number').isNumeric().custom((value) => value > 0),
  ],
  validateRequest,
  withdrawMoney
);

router.post(
  '/transfer',
  protect,
  [
    body('receiverAccountNumber', 'Receiver Account Number is required').not().isEmpty(),
    body('amount', 'Amount must be a positive number').isNumeric().custom((value) => value > 0),
  ],
  validateRequest,
  transferMoney
);

router.get('/', protect, getTransactions);

export default router;
