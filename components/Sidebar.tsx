import React from 'react';
import { LayoutDashboard, AlertCircle, Bot, Users, FileText, BookOpen, ShieldAlert, Activity, Settings, LogOut, TrendingUp } from 'lucide-react';
import { UserRole } from '../types';
import { NavLink, useLocation } from 'react-router-dom';

interface SidebarProps {
  role: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout }) => {
  const location = useLocation();

  const getLinks = () => {
    const common = [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    ];

    if (role === UserRole.CLIENT) {
      return [
        ...common,
        { to: '/reports', label: 'Service Reports', icon: FileText },
        { to: '/incidents', label: 'Incidents', icon: AlertCircle },
      ];
    }

    // Lead & Agent Shared
    const internal = [
      ...common,
      { to: '/incidents', label: 'Incident Desk', icon: ShieldAlert },
      { 
        to: '/team', 
        label: role === UserRole.LEAD ? 'Team Console' : 'Resources & SOPs', 
        icon: role === UserRole.LEAD ? Users : BookOpen 
      },
      { to: '/ai-tools', label: 'AI Operations', icon: Bot },
      { 
        to: '/reports', 
        label: role === UserRole.LEAD ? 'Reporting Engine' : 'My Performance', 
        icon: role === UserRole.LEAD ? FileText : TrendingUp 
      },
    ];

    return internal;
  };

  const links = getLinks();

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="flex h-16 items-center px-6 border-b border-slate-100">
        <Activity className="h-6 w-6 text-indigo-600 mr-2" />
        <span className="text-lg font-bold text-slate-900 tracking-tight">NOC Command</span>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 px-3 py-4 space-y-1">
        {role === UserRole.LEAD && (
          <NavLink
            to="/settings"
            className={({ isActive }) => `group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-slate-500" />
            Admin Settings
          </NavLink>
        )}
        <button 
          onClick={onLogout}
          className="w-full group flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-red-500" />
          Sign Out
        </button>
      </div>

      <div className="border-t border-slate-100 p-4">
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-slate-900">System Status</p>
              <p className="text-xs text-slate-500">All systems operational</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;