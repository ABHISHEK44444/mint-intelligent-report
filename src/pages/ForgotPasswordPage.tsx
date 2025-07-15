import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ForgotPasswordPage: React.FC = () => {
    const [step, setStep] = useState<'findUser' | 'resetForm'>('findUser');
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleFindUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/check-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            const data = await response.json();
            if (response.ok) {
                setStep('resetForm');
            } else {
                setError(data.message || 'No account found with that username.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        setIsLoading(true);
        const result = await auth?.resetPassword(username, newPassword);
        setIsLoading(false);

        if (result?.success) {
            setSuccess(result.message + ' You will be redirected to login in 3 seconds.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            setError(result?.message || 'An unexpected error occurred. Please try again.');
        }
    };

    const renderFindUserStep = () => (
        <form onSubmit={handleFindUser} className="space-y-6">
            <div className="relative">
                <label htmlFor="username" className="sr-only">Username</label>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div>
                <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center items-center rounded-lg py-3 px-4 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl disabled:bg-slate-400"
                >
                {isLoading ? 'Searching...' : 'Find Account'}
                </button>
            </div>
        </form>
    );

    const renderResetFormStep = () => (
         <form onSubmit={handleResetPassword} className="space-y-6">
             <p className="text-center text-slate-600">Resetting password for <span className="font-bold text-slate-800">{username}</span>.</p>
            <div className="relative">
                <label htmlFor="new-password" className="sr-only">New Password</label>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>
             <div className="relative">
                <label htmlFor="confirm-password" className="sr-only">Confirm New Password</label>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>

            <div>
                <button
                    type="submit"
                    disabled={!!success || isLoading}
                    className="group relative flex w-full justify-center items-center rounded-lg py-3 px-4 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl disabled:bg-slate-400 disabled:transform-none disabled:shadow-none"
                >
                {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
            </div>
        </form>
    );

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 font-sans">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
                <div className="mb-8 text-center">
                     <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500 pb-2">
                        Forgot Password
                    </h2>
                    <p className="text-slate-500">{step === 'findUser' ? 'Enter your username to find your account.' : 'Create a new password.'}</p>
                </div>

                {step === 'findUser' ? renderFindUserStep() : renderResetFormStep()}
                
                 {error && (
                    <div className="mt-4 flex items-center space-x-2 text-sm text-red-600">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                         <span>{error}</span>
                    </div>
                )}
                 {success && (
                    <div className="mt-4 flex items-center space-x-2 text-sm text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <span>{success}</span>
                    </div>
                )}

                <div className="mt-8 text-center text-sm">
                    <p className="text-slate-500">
                        Remember your password?{' '}
                        <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700 transition">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
          </div>
        </div>
    );
};

export default ForgotPasswordPage;
