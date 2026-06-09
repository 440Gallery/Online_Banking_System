import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Building2 } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-[#121a2f] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6" />
          <span className="text-xl font-bold">BankApp</span>
        </div>
        
        <nav className="flex items-center gap-6 text-sm font-medium">
          <span className="text-gray-300">Hello, {user?.fullName || 'User'}</span>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? "text-white" : "text-gray-400 hover:text-white transition-colors"}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/transfer" 
            className={({ isActive }) => isActive ? "text-white" : "text-gray-400 hover:text-white transition-colors"}
          >
            Transfer
          </NavLink>
          <NavLink 
            to="/transactions" 
            className={({ isActive }) => isActive ? "text-white" : "text-gray-400 hover:text-white transition-colors"}
          >
            History
          </NavLink>
          <button 
            onClick={handleLogout} 
            className="bg-[#2a3655] hover:bg-[#3a4665] px-4 py-1.5 rounded text-white transition-colors ml-2"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
