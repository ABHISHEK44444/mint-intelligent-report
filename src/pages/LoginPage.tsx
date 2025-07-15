import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const success = await auth?.login(username, password);
    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 font-sans">
      <div className="w-full max-w-5xl lg:grid lg:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden bg-white">
        
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-sky-600 to-cyan-500 text-white relative">
            <div className="absolute top-0 left-0 w-full h-full bg-cover opacity-10" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"p\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M25 0 L25 50 L0 50 M100 25 L50 25 L50 0 M75 100 L75 50 L100 50 M0 75 L50 75 L50 100\" stroke=\"%23FFFFFF\" stroke-width=\"1\" fill=\"none\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%\" height=\"100%\" fill=\"url(%23p)\"/%3E%3C/svg%3E')"}}></div>
            <div className="z-10">
                 <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10"><path d="M15 3H9a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                    <span className="text-2xl font-bold">Mint IntelliReport</span>
                </div>
            </div>
             <div className="z-10">
                <h1 className="text-4xl font-extrabold leading-tight">AI-Driven Insights.</h1>
                <p className="mt-4 text-lg opacity-80">Unlock your sales potential and streamline reporting with intelligent analytics.</p>
            </div>
             <div className="z-10 text-xs opacity-60">
                &copy; {new Date().getFullYear()} Mint IntelliReport Inc. All rights reserved.
            </div>
        </div>

        <div className="p-8 sm:p-16 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">
                <div className="mb-8 text-center lg:text-left">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500 pb-2">
                        Welcome Back
                    </h2>
                    <p className="text-slate-500">Please sign in to continue.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="relative">
                            <label htmlFor="password-input" className="sr-only">Password</label>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            <input
                                id="password-input"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                         <div className="text-right mt-2">
                            <Link to="/forgot-password" className="text-sm font-medium text-sky-600 hover:text-sky-700">
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                    
                    {error && (
                        <div className="flex items-center space-x-2 text-sm text-red-600">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                             <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative flex w-full justify-center items-center rounded-lg py-3 px-4 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl disabled:bg-slate-400 disabled:scale-100"
                        >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
