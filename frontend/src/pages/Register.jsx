import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Building2, Loader2, Calendar, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Page 1
    fullName: '',
    fathersName: '',
    gender: '',
    dob: '',
    email: '',
    maritalStatus: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    // Page 2
    religion: 'Hindu',
    category: 'General',
    income: '< 1,50,000',
    educationalQualification: 'Non-Graduate',
    occupation: 'Self-Employed',
    panNumber: '',
    aadhaarNumber: '',
    seniorCitizen: 'No',
    existingAccount: 'No',
    // Page 3
    accountType: 'Savings Account',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1) {
      const { fullName, fathersName, gender, dob, email, maritalStatus, address, city, state, pinCode } = formData;
      if (!fullName || !fathersName || !gender || !dob || !email || !maritalStatus || !address || !city || !state || !pinCode) {
        return toast.error('Please fill in all mandatory fields on this page');
      }
    } else if (step === 2) {
      const { panNumber, aadhaarNumber } = formData;
      if (!panNumber || !aadhaarNumber) {
        return toast.error('Please provide PAN and Aadhaar numbers');
      }
      if (panNumber.length !== 12 || aadhaarNumber.length !== 12) {
        return toast.error('PAN card and Aadhaar card must be exactly 12 characters long');
      }
    }
    setStep(step + 1);
  };
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setIsSubmitting(true);
    try {
      await register(formData);
      toast.success('Registration successful! Account created.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <Building2 className="h-8 w-8 text-white" />
        <span className="text-2xl font-bold text-white">BankApp</span>
      </div>
      <div className="absolute top-6 right-6 flex items-center gap-4 text-white font-medium">
        <Link to="/login" className="hover:text-gray-300">Login</Link>
        <Link to="/register" className="hover:text-gray-300">Register</Link>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 sm:p-10">
        <div className="flex flex-col items-center mb-8">
          <Building2 className="h-12 w-12 text-black mb-2" />
          <h2 className="text-2xl font-bold text-black uppercase text-center">Application Form No. 1</h2>
          <p className="text-gray-500 text-sm mt-1">Page {step}: {step === 1 ? 'Personal Details' : step === 2 ? 'Additional Details' : 'Account Setup'}</p>
        </div>

        <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()} className="space-y-6">
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Name:</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Father's Name:</label>
                <input type="text" name="fathersName" value={formData.fathersName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-blue-50/50" />
              </div>
              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Gender:</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} className="text-blue-500 focus:ring-blue-500" /> <span className="text-sm">Male</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} className="text-blue-500 focus:ring-blue-500" /> <span className="text-sm">Female</span>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Date of Birth:</label>
                <div className="relative">
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 appearance-none" />
                </div>
              </div>
              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Email Address:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Marital Status:</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="maritalStatus" value="Married" checked={formData.maritalStatus === 'Married'} onChange={handleChange} className="text-blue-500 focus:ring-blue-500" /> <span className="text-sm">Married</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="maritalStatus" value="Unmarried" checked={formData.maritalStatus === 'Unmarried'} onChange={handleChange} className="text-blue-500 focus:ring-blue-500" /> <span className="text-sm">Unmarried</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="maritalStatus" value="Other" checked={formData.maritalStatus === 'Other'} onChange={handleChange} className="text-blue-500 focus:ring-blue-500" /> <span className="text-sm">Other</span>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Address:</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">City:</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">State:</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Pin Code:</label>
                <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              </div>

              <div className="flex justify-end pt-4">
                <button type="button" onClick={handleNext} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-colors">
                  Next Page
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Religion:</label>
                <select name="religion" value={formData.religion} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white">
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Category:</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white">
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>
              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Income:</label>
                <select name="income" value={formData.income} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white">
                  <option value="< 1,50,000">&lt; 1,50,000</option>
                  <option value="1,50,000 - 5,000,000">1,50,000 - 5,000,000</option>
                  <option value="> 5,000,000">&gt; 5,000,000</option>
                </select>
              </div>
              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Educational Qualification:</label>
                <select name="educationalQualification" value={formData.educationalQualification} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white">
                  <option value="Non-Graduate">Non-Graduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post-Graduate">Post-Graduate</option>
                </select>
              </div>
              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Occupation:</label>
                <select name="occupation" value={formData.occupation} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white">
                  <option value="Self-Employed">Self-Employed</option>
                  <option value="Salaried">Salaried</option>
                  <option value="Student">Student</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">PAN Number:</label>
                <input type="text" name="panNumber" maxLength="12" value={formData.panNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Aadhar Number:</label>
                <input type="text" name="aadhaarNumber" maxLength="12" value={formData.aadhaarNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Senior Citizen:</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="seniorCitizen" value="Yes" checked={formData.seniorCitizen === 'Yes'} onChange={handleChange} className="text-blue-500 focus:ring-blue-500" /> <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="seniorCitizen" value="No" checked={formData.seniorCitizen === 'No'} onChange={handleChange} className="text-blue-500 focus:ring-blue-500" /> <span className="text-sm">No</span>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Existing Account:</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="existingAccount" value="Yes" checked={formData.existingAccount === 'Yes'} onChange={handleChange} className="text-blue-500 focus:ring-blue-500" /> <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="existingAccount" value="No" checked={formData.existingAccount === 'No'} onChange={handleChange} className="text-blue-500 focus:ring-blue-500" /> <span className="text-sm">No</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button type="button" onClick={handleBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-md transition-colors">
                  Back
                </button>
                <button type="button" onClick={handleNext} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-colors">
                  Next Page
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Choose Account Type:</label>
                <select name="accountType" value={formData.accountType} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white">
                  <option value="Savings Account">Savings Account</option>
                  <option value="Current Account">Current Account</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Set up a strong password for web banking:</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:border-blue-500 bg-white pr-10" 
                    placeholder="Password" 
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button type="button" onClick={handleBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-md transition-colors">
                  Back
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-md transition-colors flex items-center gap-2 disabled:opacity-70">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Submit & Create Account
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="mt-8 text-center text-gray-600 text-sm">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
