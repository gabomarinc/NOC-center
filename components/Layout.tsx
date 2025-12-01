import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { User } from '../types';
import { Bell, Search, Menu, X, AlertCircle, Users, BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_INCIDENTS, MOCK_TEAM, MOCK_PLAYBOOKS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

// Unified Result Type for the Search
interface SearchResult {
  id: string;
  type: 'INCIDENT' | 'TEAM' | 'PLAYBOOK';
  title: string;
  subtitle: string;
  link: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Cargar widget flotante de GPTMaker en todas las páginas autenticadas (no en Login)
  useEffect(() => {
    const src = 'https://app.gptmaker.ai/widget/3EB0DDDF8DBDD3F6197E06A5C4F8C192/float.js';
    const alreadyLoaded = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (alreadyLoaded) return;

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Al hacer logout desmontamos Layout y retiramos el widget
      script.remove();
    };
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setResults([]);
      setIsSearchOpen(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const newResults: SearchResult[] = [];

    // Search Incidents
    MOCK_INCIDENTS.forEach(inc => {
      if (inc.title.toLowerCase().includes(lowerQuery) || inc.id.toLowerCase().includes(lowerQuery)) {
        newResults.push({
          id: inc.id,
          type: 'INCIDENT',
          title: inc.title,
          subtitle: `${inc.id} • ${inc.status}`,
          link: '/incidents'
        });
      }
    });

    // Search Team
    MOCK_TEAM.forEach(member => {
      if (member.name.toLowerCase().includes(lowerQuery) || member.role.toLowerCase().includes(lowerQuery)) {
        newResults.push({
          id: member.id,
          type: 'TEAM',
          title: member.name,
          subtitle: member.role,
          link: '/team'
        });
      }
    });

    // Search Playbooks
    MOCK_PLAYBOOKS.forEach(pb => {
      if (pb.title.toLowerCase().includes(lowerQuery)) {
        newResults.push({
          id: pb.id,
          type: 'PLAYBOOK',
          title: pb.title,
          subtitle: `SOP • ${pb.category}`,
          link: '/team'
        });
      }
    });

    setResults(newResults);
    setIsSearchOpen(true);
  };

  const handleResultClick = (link: string) => {
    navigate(link);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setIsSearchOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar role={user.role} onLogout={onLogout} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 z-20">
          <div className="flex items-center md:hidden">
            <button className="text-slate-500 hover:text-slate-700">
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          <div className="hidden md:flex flex-1 items-center max-w-xl relative" ref={searchRef}>
             <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => { if(searchQuery.length >= 2) setIsSearchOpen(true); }}
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Search incidents, team members, or playbooks..."
                />
                {searchQuery && (
                  <button 
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
             </div>

             {/* Search Results Dropdown */}
             {isSearchOpen && (
               <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-xl border border-slate-200 max-h-96 overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-100">
                  {results.length > 0 ? (
                    <div className="py-2">
                       <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Found {results.length} results
                       </div>
                       {results.map((result) => (
                         <button
                           key={`${result.type}-${result.id}`}
                           onClick={() => handleResultClick(result.link)}
                           className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start space-x-3 transition-colors border-b border-slate-50 last:border-0"
                         >
                            <div className={`p-2 rounded-md flex-shrink-0 ${
                              result.type === 'INCIDENT' ? 'bg-red-50 text-red-600' :
                              result.type === 'TEAM' ? 'bg-indigo-50 text-indigo-600' :
                              'bg-emerald-50 text-emerald-600'
                            }`}>
                               {result.type === 'INCIDENT' && <AlertCircle className="h-4 w-4" />}
                               {result.type === 'TEAM' && <Users className="h-4 w-4" />}
                               {result.type === 'PLAYBOOK' && <BookOpen className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="text-sm font-medium text-slate-900 truncate">{result.title}</p>
                               <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300 self-center" />
                         </button>
                       ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500">
                       <p className="text-sm">No results found for "{searchQuery}"</p>
                    </div>
                  )}
               </div>
             )}
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
