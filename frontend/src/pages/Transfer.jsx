import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowUpRight, Loader2, Users } from 'lucide-react';

const Transfer = () => {
  const [receiverAccountNumber, setReceiverAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!receiverAccountNumber || !amount || isNaN(amount) || amount <= 0) {
      return toast.error('Please enter valid account and amount');
    }
    if (amount > user.account.balance) {
      return toast.error('Insufficient balance');
    }
    if (receiverAccountNumber === user.account.accountNumber) {
       return toast.error('Cannot transfer to your own account');
    }

    setLoading(true);
    try {
      await api.post('/transactions/transfer', { receiverAccountNumber, amount: Number(amount), description });
      toast.success('Transfer successful!');
      navigate('/dashboard');
      window.dispatchEvent(new Event('refresh-user'));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Transfer Money</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 max-w-xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
            <Users className="h-8 w-8" />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Available Balance</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{user?.account?.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        </div>

        <form onSubmit={handleTransfer} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Receiver Account Number</label>
            <input
              type="text"
              value={receiverAccountNumber}
              onChange={(e) => setReceiverAccountNumber(e.target.value)}
              className="w-full px-4 py-3 font-mono text-lg tracking-wider border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              placeholder="e.g. 987123456789"
              maxLength="15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                placeholder="0.00"
                min="1"
                step="0.01"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              placeholder="e.g. Gift, Dinner"
              maxLength="50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Transfer Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transfer;
