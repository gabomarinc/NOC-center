import React, { useState } from 'react';
import { UserRole, User, IntegrationConfig, AIConfig, TeamMember, Playbook } from '../types';
import { MOCK_TEAM, MOCK_PLAYBOOKS } from '../constants';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '../components/ui';
import { User as UserIcon, Lock, Zap, Hash, Workflow, CheckCircle2, XCircle, Eye, EyeOff, Save, Loader2, Cpu, Globe, Key, AlertTriangle, Shield, Users, BookOpen, FileText, Check, Trash2, Edit, Plus } from 'lucide-react';

interface SettingsProps {
  user: User;
}

// Extend types locally for state management in this view
interface ManagedMember extends TeamMember {
  permissions: {
    canDeleteTickets: boolean;
    canManageIntegrations: boolean;
    canEditReports: boolean;
  };
  adminNotes: string;
}

interface ManagedPlaybook extends Playbook {
  clarificationNotes: string;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'integrations' | 'ai' | 'management'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});

  // Mock Data States
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([
    { id: 'int_1', name: 'Slack Notifications', provider: 'slack', status: 'connected', webhookUrl: 'https://hooks.slack.com/services/T000/B000/XXXX', lastSync: '10 mins ago' },
    { id: 'int_2', name: 'Zapier Automation', provider: 'zapier', status: 'disconnected', apiKey: '' },
    { id: 'int_3', name: 'Make.com Scenarios', provider: 'make', status: 'connected', webhookUrl: 'https://hook.us1.make.com/xxxx', lastSync: '1 hour ago' },
  ]);

  const [aiConfig, setAiConfig] = useState<AIConfig>({
    provider: 'gemini',
    apiKey: 'AIzaSyExampleKeyObfuscated12345',
    model: 'gemini-1.5-pro',
    temperature: 0.7
  });

  // Team Management State
  const [members, setMembers] = useState<ManagedMember[]>(MOCK_TEAM.map(m => ({
    ...m,
    permissions: {
      canDeleteTickets: m.role.includes('Lead'),
      canManageIntegrations: m.role.includes('Lead'),
      canEditReports: true
    },
    adminNotes: m.id === 't1' ? 'High potential for Lead role. Consistently resolves L3 tickets under SLA.' : ''
  })));

  // Playbook Management State
  const [playbooks, setPlaybooks] = useState<ManagedPlaybook[]>(MOCK_PLAYBOOKS.map(p => ({
    ...p,
    clarificationNotes: p.id === 'pb1' ? 'Ensure read replicas are fully synced before promotion to avoid data loss.' : ''
  })));

  if (user.role !== UserRole.LEAD) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <Lock className="h-12 w-12 mb-4 text-slate-300" />
        <h2 className="text-lg font-semibold text-slate-900">Access Restricted</h2>
        <p>You do not have permission to view Admin Settings.</p>
      </div>
    );
  }

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1500);
  };

  const toggleVisibility = (key: string) => {
    setShowApiKey(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(int => {
      if (int.id === id) {
        return { ...int, status: int.status === 'connected' ? 'disconnected' : 'connected' };
      }
      return int;
    }));
  };

  const updateMemberPermission = (id: string, key: keyof ManagedMember['permissions']) => {
    setMembers(prev => prev.map(m => 
      m.id === id ? { ...m, permissions: { ...m.permissions, [key]: !m.permissions[key] } } : m
    ));
  };

  const updateMemberNote = (id: string, note: string) => {
    setMembers(prev => prev.map(m => 
      m.id === id ? { ...m, adminNotes: note } : m
    ));
  };

  const updatePlaybookNote = (id: string, note: string) => {
    setPlaybooks(prev => prev.map(p => 
      p.id === id ? { ...p, clarificationNotes: note } : p
    ));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Settings</h1>
        <p className="text-sm text-slate-500">Manage your profile, external integrations, AI engine, and team governance.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg w-full md:w-max overflow-x-auto">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'profile' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
        >
          Profile & Security
        </button>
        <button 
          onClick={() => setActiveTab('integrations')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'integrations' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
        >
          Integrations
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'ai' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
        >
          AI Engine
        </button>
        <button 
          onClick={() => setActiveTab('management')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'management' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
        >
          Team & Playbooks
        </button>
      </div>

      {/* --- PROFILE TAB --- */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-left-4 duration-300">
          <Card className="md:col-span-1">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="relative">
                <img src={user.avatar} alt="Profile" className="h-24 w-24 rounded-full ring-4 ring-slate-50 mb-4" />
                <span className="absolute bottom-4 right-0 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-sm text-slate-500 mb-4">Lead NOC Engineer</p>
              <Badge variant="outline">Administrator</Badge>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input type="text" defaultValue={user.name} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <input type="email" defaultValue="sarah.connor@noc-command.com" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Role</label>
                  <input type="text" disabled defaultValue="System Admin" className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Timezone</label>
                  <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                    <option>UTC (GMT+0)</option>
                    <option>EST (GMT-5)</option>
                    <option>PST (GMT-8)</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : <><Save className="mr-2 h-4 w-4"/> Save Changes</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- INTEGRATIONS TAB --- */}
      {activeTab === 'integrations' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="grid grid-cols-1 gap-6">
            {integrations.map((integration) => (
              <Card key={integration.id} className={`border-l-4 ${integration.status === 'connected' ? 'border-l-emerald-500' : 'border-l-slate-300'}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        integration.provider === 'slack' ? 'bg-[#4A154B] text-white' :
                        integration.provider === 'zapier' ? 'bg-[#FF4F00] text-white' :
                        'bg-[#6e3baa] text-white' // Make
                      }`}>
                        {integration.provider === 'slack' && <Hash className="h-6 w-6" />}
                        {integration.provider === 'zapier' && <Zap className="h-6 w-6" />}
                        {integration.provider === 'make' && <Workflow className="h-6 w-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900">{integration.name}</h3>
                          {integration.status === 'connected' ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                              Connected
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                              Disconnected
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          {integration.provider === 'slack' ? 'Post incident updates to #ops-alerts channel.' : 
                           integration.provider === 'zapier' ? 'Trigger Zaps on new critical ticket creation.' :
                           'Sync ticket resolution data with Zoho CRM.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                       <Button 
                        variant={integration.status === 'connected' ? 'outline' : 'primary'} 
                        onClick={() => toggleIntegration(integration.id)}
                        className="w-full md:w-auto"
                      >
                         {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                       </Button>
                    </div>
                  </div>

                  {integration.status === 'connected' && (
                    <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-xs font-medium text-slate-500 uppercase">Configuration Endpoint / Key</label>
                           <div className="relative">
                              <input 
                                type={showApiKey[integration.id] ? "text" : "password"} 
                                value={integration.apiKey || integration.webhookUrl || ""} 
                                readOnly
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-600 font-mono pr-10"
                              />
                              <button 
                                onClick={() => toggleVisibility(integration.id)}
                                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                              >
                                {showApiKey[integration.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                           </div>
                        </div>
                        <div className="space-y-1">
                           <label className="text-xs font-medium text-slate-500 uppercase">Last Sync</label>
                           <div className="text-sm text-slate-700 py-2 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              {integration.lastSync || 'Never'}
                           </div>
                        </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-end pt-4">
               <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : <><Save className="mr-2 h-4 w-4"/> Update Configurations</>}
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- AI ENGINE TAB --- */}
      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
           <div className="lg:col-span-2 space-y-6">
              <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <Cpu className="h-5 w-5 text-indigo-600" />
                       Model Provider
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div 
                          className={`relative border rounded-xl p-4 cursor-pointer transition-all ${aiConfig.provider === 'openai' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300'}`}
                          onClick={() => setAiConfig({...aiConfig, provider: 'openai', model: 'gpt-4-turbo'})}
                       >
                          <div className="flex items-center justify-between mb-2">
                             <div className="font-semibold text-slate-900">OpenAI</div>
                             {aiConfig.provider === 'openai' && <CheckCircle2 className="h-5 w-5 text-indigo-600" />}
                          </div>
                          <p className="text-xs text-slate-500">GPT-4 Turbo. Standard industry performance.</p>
                       </div>
                       
                       <div 
                          className={`relative border rounded-xl p-4 cursor-pointer transition-all ${aiConfig.provider === 'gemini' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300'}`}
                          onClick={() => setAiConfig({...aiConfig, provider: 'gemini', model: 'gemini-1.5-pro'})}
                       >
                          <div className="flex items-center justify-between mb-2">
                             <div className="font-semibold text-slate-900">Google Gemini</div>
                             {aiConfig.provider === 'gemini' && <CheckCircle2 className="h-5 w-5 text-indigo-600" />}
                          </div>
                          <p className="text-xs text-slate-500">Gemini 1.5 Pro. Huge context window for log analysis.</p>
                       </div>
                    </div>

                    <div className="space-y-2 pt-4">
                       <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Key className="h-4 w-4" /> API Key
                       </label>
                       <div className="relative">
                          <input 
                             type={showApiKey['ai'] ? "text" : "password"} 
                             value={aiConfig.apiKey}
                             onChange={(e) => setAiConfig({...aiConfig, apiKey: e.target.value})}
                             className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                             placeholder="sk-..."
                          />
                          <button 
                             onClick={() => toggleVisibility('ai')}
                             className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                          >
                             {showApiKey['ai'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                       </div>
                       <p className="text-xs text-slate-500">Your key is encrypted at rest.</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                       <div className="flex justify-between">
                          <label className="text-sm font-medium text-slate-700">Temperature (Creativity)</label>
                          <span className="text-sm font-mono text-slate-600">{aiConfig.temperature}</span>
                       </div>
                       <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.1" 
                          value={aiConfig.temperature}
                          onChange={(e) => setAiConfig({...aiConfig, temperature: parseFloat(e.target.value)})}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                       />
                       <div className="flex justify-between text-xs text-slate-400">
                          <span>Precise</span>
                          <span>Creative</span>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>

           <div className="lg:col-span-1 space-y-6">
              <Card className="bg-slate-900 text-white border-slate-800">
                 <CardHeader>
                    <CardTitle className="text-slate-200 flex items-center gap-2">
                       <Globe className="h-4 w-4" /> Usage Quota
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       <div>
                          <div className="flex justify-between text-xs mb-1">
                             <span className="text-slate-400">Tokens Used</span>
                             <span className="text-slate-200">1.2M / 2M</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                             <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                       </div>
                       <div>
                          <div className="flex justify-between text-xs mb-1">
                             <span className="text-slate-400">Monthly Cost Est.</span>
                             <span className="text-slate-200">$24.50</span>
                          </div>
                       </div>
                       <div className="p-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg text-xs text-indigo-300 flex gap-2">
                          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                          Cost alert set at $50.00
                       </div>
                    </div>
                 </CardContent>
              </Card>
              
              <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isSaving} className="w-full">
                     {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : <><Save className="mr-2 h-4 w-4"/> Save Configuration</>}
                  </Button>
              </div>
           </div>
        </div>
      )}

      {/* --- MANAGEMENT TAB (NEW) --- */}
      {activeTab === 'management' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Section 1: Team Governance */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                   <Shield className="h-5 w-5 text-indigo-600" /> Team Governance & Permissions
                </h2>
                <Button size="sm" variant="secondary"><Plus className="h-4 w-4 mr-2" /> Invite Member</Button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {members.map(member => (
                   <Card key={member.id} className="overflow-hidden border-slate-200">
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                         <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                               {member.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                               <span className="text-sm font-semibold text-slate-900">{member.name}</span>
                               <span className="text-[10px] text-slate-500 uppercase">{member.role}</span>
                            </div>
                         </div>
                         <div className="flex gap-1">
                            <button className="p-1 hover:bg-white rounded text-slate-400 hover:text-indigo-600 transition-colors"><Edit className="h-4 w-4" /></button>
                         </div>
                      </div>
                      <CardContent className="p-4 space-y-4">
                         {/* Permissions Toggles */}
                         <div className="space-y-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Access Control</span>
                            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                               <span className="text-xs text-slate-700">Can Delete Tickets</span>
                               <button 
                                 onClick={() => updateMemberPermission(member.id, 'canDeleteTickets')}
                                 className={`w-8 h-4 rounded-full relative transition-colors ${member.permissions.canDeleteTickets ? 'bg-indigo-600' : 'bg-slate-300'}`}
                               >
                                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${member.permissions.canDeleteTickets ? 'left-4.5' : 'left-0.5'}`} style={{ left: member.permissions.canDeleteTickets ? '18px' : '2px' }}></div>
                               </button>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                               <span className="text-xs text-slate-700">Manage Integrations</span>
                               <button 
                                 onClick={() => updateMemberPermission(member.id, 'canManageIntegrations')}
                                 className={`w-8 h-4 rounded-full relative transition-colors ${member.permissions.canManageIntegrations ? 'bg-indigo-600' : 'bg-slate-300'}`}
                               >
                                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm`} style={{ left: member.permissions.canManageIntegrations ? '18px' : '2px' }}></div>
                               </button>
                            </div>
                         </div>

                         {/* Admin Notes */}
                         <div>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Admin Notes / Reviews</span>
                            <textarea 
                               className="w-full text-xs p-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                               rows={3}
                               value={member.adminNotes}
                               onChange={(e) => updateMemberNote(member.id, e.target.value)}
                               placeholder="Private notes about this team member..."
                            />
                         </div>
                      </CardContent>
                   </Card>
                ))}
             </div>
          </div>

          <div className="border-t border-slate-200 my-6"></div>

          {/* Section 2: Playbook Management */}
          <div className="space-y-4">
             <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" /> Playbook Configurations
             </h2>
             
             <div className="space-y-4">
                {playbooks.map(playbook => (
                   <Card key={playbook.id} className="border-slate-200">
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                         <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-white border border-slate-200 rounded">
                               <FileText className="h-4 w-4 text-indigo-600" />
                            </div>
                            <span className="font-semibold text-sm text-slate-900">{playbook.title}</span>
                            <Badge variant="outline" className="text-[10px] bg-white">{playbook.category}</Badge>
                         </div>
                         <Button size="sm" variant="ghost" className="h-7 text-xs">Edit Steps</Button>
                      </div>
                      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Automation Steps</span>
                            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                               {playbook.steps.map((step, i) => (
                                  <li key={i}>{step}</li>
                               ))}
                            </ul>
                         </div>
                         <div className="space-y-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Admin Clarification Context</span>
                            <textarea 
                               className="w-full text-xs p-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                               rows={3}
                               value={playbook.clarificationNotes}
                               onChange={(e) => updatePlaybookNote(playbook.id, e.target.value)}
                               placeholder="Add context or warnings for agents running this playbook..."
                            />
                            <p className="text-[10px] text-slate-400">This text will be highlighted to agents when they run this procedure.</p>
                         </div>
                      </CardContent>
                   </Card>
                ))}
             </div>
             
             <div className="flex justify-end pt-6">
                 <Button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto">
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : <><Save className="mr-2 h-4 w-4"/> Save All Changes</>}
                 </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;