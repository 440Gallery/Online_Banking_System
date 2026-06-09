import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Settings, UserX, Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    password: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        password: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      const res = await api.put('/auth/profile', updateData);
      // Wait for auth context to update using our method
      await updateProfile(); 
      toast.success('Profile updated successfully');
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.delete('/auth/profile');
      toast.success('Account deleted successfully');
      logout();
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Profile Info & Edit Form */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
            <Settings className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h3>
          </div>
          
          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password (leave blank to keep current)</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none" placeholder="••••••••" />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUpdating ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Read-Only Info & Danger Zone */}
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Account Details</h3>
            <div className="space-y-4 text-sm">
               <div>
                  <p className="text-gray-500 dark:text-gray-400">Email Address</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
               </div>
               <div>
                  <p className="text-gray-500 dark:text-gray-400">Account Number</p>
                  <p className="font-mono font-medium text-gray-900 dark:text-white">{user.account.accountNumber}</p>
               </div>
               <div>
                  <p className="text-gray-500 dark:text-gray-400">PAN Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user.panNumber}</p>
               </div>
               <div>
                  <p className="text-gray-500 dark:text-gray-400">Aadhaar Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user.aadhaarNumber}</p>
               </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 p-6">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 mb-2">
              <UserX className="h-5 w-5" /> Danger Zone
            </h3>
            <p className="text-sm text-red-700/70 dark:text-red-400/70 mb-4">
              Once you delete your account, there is no going back. Please be certain. You must have a zero balance to delete your account.
            </p>
            
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-white dark:bg-gray-800 text-red-600 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 border border-red-200 dark:border-red-800 px-4 py-2 rounded-lg text-sm font-semibold transition-colors w-full"
              >
                Delete Account
              </button>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">Are you absolutely sure?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex-1 flex justify-center"
                  >
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Yes, Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-semibold flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
