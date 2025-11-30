import React from 'react';
import Sidebar from './Sidebar';
import { User } from '../types';
import { Bell, Search, Menu } from 'lucide-react';
import { Select } from './ui';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar role={user.role} onLogout={onLogout} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="flex items-center md:hidden">
            <button className="text-slate-500 hover:text-slate-700">
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          <div className="hidden md:flex flex-1 items-center max-w-xl">
             <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Search incidents, logs, or assets..."
                />
             </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative rounded-full bg-white p-1 text-slate-400 hover:text-slate-500">
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
              <div className="flex flex-col text-right">
                <span className="text-sm font-medium text-slate-900">{user.name}</span>
                <span className="text-xs text-slate-500">{user.role}</span>
              </div>
              <img
                className="h-8 w-8 rounded-full ring-2 ring-slate-100"
                src={user.avatar}
                alt=""
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;