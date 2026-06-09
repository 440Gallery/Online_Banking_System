import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // We need to fetch the latest user info to get the updated balance after a transaction.
  const [currentAccount, setCurrentAccount] = useState(user?.account);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setCurrentAccount(res.data.account);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) {
      return toast.error('Please enter a valid amount');
    }
    setIsProcessing(true);
    try {
      await api.post('/transactions/deposit', { amount: Number(depositAmount) });
      toast.success(`₹${depositAmount} deposited successfully!`);
      setDepositAmount('');
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deposit failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
      return toast.error('Please enter a valid amount');
    }
    setIsProcessing(true);
    try {
      await api.post('/transactions/withdraw', { amount: Number(withdrawAmount) });
      toast.success(`₹${withdrawAmount} withdrawn successfully!`);
      setWithdrawAmount('');
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await api.delete('/auth/profile');
        toast.success("Account deleted successfully");
        logout();
        navigate('/login');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete account');
      }
    }
  };

  if (!user || !currentAccount) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Current Balance Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Current Balance</h3>
            <div className="text-sm text-gray-500 mb-1">Account ID: <span className="font-medium text-gray-700">#{currentAccount.accountNumber}</span></div>
            <div className="text-sm text-gray-500 mb-4">Account Type: <span className="font-medium text-gray-700">{currentAccount.accountType}</span></div>
            <h1 className="text-5xl font-bold text-gray-900 mb-8">₹{currentAccount.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/transfer')}
              className="bg-[#3b82f6] hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors w-full"
            >
              Transfer Money
            </button>
            <button 
              onClick={handleDeleteAccount}
              className="bg-[#ef4444] hover:bg-red-600 text-white font-medium py-3 rounded-lg transition-colors w-full"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Quick Transactions Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <h3 className="font-bold text-gray-800 mb-6">Quick Transactions</h3>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <input 
                type="number" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Amount"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button 
                onClick={handleDeposit}
                disabled={isProcessing}
                className="bg-[#10b981] hover:bg-green-600 text-white font-medium px-8 py-3 rounded-lg transition-colors disabled:opacity-70 w-32"
              >
                Deposit
              </button>
            </div>
            
            <div className="flex gap-4">
              <input 
                type="number" 
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button 
                onClick={handleWithdraw}
                disabled={isProcessing}
                className="bg-[#ef4444] hover:bg-red-600 text-white font-medium px-8 py-3 rounded-lg transition-colors disabled:opacity-70 w-32"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
