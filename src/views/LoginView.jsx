import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';

const DEMO_CREDENTIALS = {
  email: 'demo@pmlite.io',
  password: 'demo123'
};

const loadingMessages = [
  'Verifying credentials...',
  'Loading your workspace...',
  'Preparing dashboard...'
];

const LoginView = () => {
  const [loading, setLoading] = useState(false);
  const [currentMsg, setCurrentMsg] = useState('');
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    let msgIndex = 0;
    if (loading) {
      setCurrentMsg(loadingMessages[0]);
      interval = setInterval(() => {
        msgIndex = (msgIndex + 1) % loadingMessages.length;
        setCurrentMsg(loadingMessages[msgIndex]);
      }, 400);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      navigate('/app');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {!loading ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <LogIn className="w-8 h-8 text-green-700" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome to PM Lite</h1>
              <p className="mt-2 text-gray-500">Sign in to manage your product work</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-green-700 text-white py-3 rounded-lg font-medium shadow-lg hover:bg-green-800 hover:shadow-xl transition-all duration-200"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                <span className="font-medium text-gray-700">Demo credentials pre-filled</span>
                <br />
                Just click Sign In to explore the app
              </p>
            </div>
          </>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mb-6"></div>
            <p className="text-gray-600 font-medium animate-pulse">
              {currentMsg}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginView;






