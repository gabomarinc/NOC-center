import React, { useState } from 'react';
import { Activity, ShieldCheck, Users, Briefcase, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserRole, User } from '../types';
import { MOCK_USERS } from '../constants';
import { Button } from '../components/ui';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API network delay
    setTimeout(() => {
      // Find user by email (mock auth)
      const foundUserRole = Object.keys(MOCK_USERS).find(
        (key) => MOCK_USERS[key as UserRole].email === email
      ) as UserRole | undefined;

      if (foundUserRole && password === 'demo') {
        onLogin(MOCK_USERS[foundUserRole]);
      } else {
        setError('Invalid credentials. (Hint: Password is "demo")');
        setLoading(false);
      }
    }, 800);
  };

  const quickLogin = (role: UserRole) => {
    const user = MOCK_USERS[role];
    if (user.email) {
      setEmail(user.email);
      setPassword('demo');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
          <Activity className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">NOC Command Center</h1>
        <p className="text-slate-500 mt-2">Operational Intelligence Platform</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-sm text-slate-500 mt-1">Access your role-based dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="name@company.com"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-md text-xs text-red-600 flex items-center">
                <Lock className="h-3 w-3 mr-2" />
                {error}
              </div>
            )}

            <Button 
              type="submit"
              className="w-full h-11 text-base bg-slate-900 hover:bg-slate-800"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">Demo Roles</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => quickLogin(UserRole.LEAD)}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mb-2 group-hover:bg-indigo-200">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Lead</span>
            </button>
            <button 
              onClick={() => quickLogin(UserRole.AGENT)}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
            >
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mb-2 group-hover:bg-emerald-200">
                <Users className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Agent</span>
            </button>
            <button 
              onClick={() => quickLogin(UserRole.CLIENT)}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all group"
            >
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mb-2 group-hover:bg-amber-200">
                <Briefcase className="h-4 w-4 text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Client</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-slate-400 text-xs">
        <CheckCircle2 className="h-3 w-3" />
        <span>Secure Role-Based Access Control Demo</span>
      </div>
    </div>
  );
};

export default Login;