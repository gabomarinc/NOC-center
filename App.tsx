import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Incidents from './views/Incidents';
import AITools from './views/AITools';
import Reports from './views/Reports';
import Team from './views/Team';
import Settings from './views/Settings';
import Login from './views/Login';
import { UserRole, User } from './types';

const App: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout user={currentUser} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard role={currentUser.role} />} />
          <Route path="/incidents" element={<Incidents role={currentUser.role} />} />
          <Route path="/ai-tools" element={<AITools role={currentUser.role} />} />
          <Route path="/reports" element={<Reports role={currentUser.role} />} />
          <Route path="/team" element={<Team role={currentUser.role} />} />
          <Route path="/settings" element={<Settings user={currentUser} />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;