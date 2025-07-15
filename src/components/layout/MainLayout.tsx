import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Role } from '../../types';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (auth) {
      auth.logout();
      navigate('/login');
    }
  };
  
  const linkStyles = "px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white";
  const activeLinkStyles = "bg-slate-900 text-white";

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-50">
      <nav className="bg-slate-800">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-sky-400"><path d="M15 3H9a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
              </div>
              <span className="text-white font-bold ml-2">Mint IntelliReport</span>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink to="/dashboard" className={({isActive}) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>Dashboard</NavLink>
                  {auth?.currentUser?.role === Role.ADMIN && (
                    <NavLink to="/admin" className={({isActive}) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>Admin Panel</NavLink>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center">
                <span className="text-slate-400 text-sm mr-4">Welcome, {auth?.currentUser?.name}</span>
                 <button onClick={handleLogout} className="flex items-center text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    Logout
                </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
