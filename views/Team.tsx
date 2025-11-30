import React, { useState } from 'react';
import { UserRole, TeamMember } from '../types';
import { MOCK_TEAM, MOCK_PLAYBOOKS } from '../constants';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Tooltip } from '../components/ui';
import { Users, Search, BookOpen, GitMerge, Phone, MoreHorizontal, X, CheckCircle2, Clock, AlertCircle, Briefcase, BarChart3, ArrowUpRight, Sparkles, MapPin, Globe, TrendingUp, BrainCircuit, Loader2, Check } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface TeamProps {
  role: UserRole;
}

const Team: React.FC<TeamProps> = ({ role }) => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [playbookStatus, setPlaybookStatus] = useState<Record<string, 'IDLE' | 'RUNNING' | 'COMPLETED'>>({});

  if (role === UserRole.CLIENT) {
    return <div className="p-10 text-center text-slate-500">Access Restricted: Internal Use Only</div>;
  }

  const handleRunPlaybook = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Prevent multiple clicks
    if (playbookStatus[id] === 'RUNNING' || playbookStatus[id] === 'COMPLETED') return;

    setPlaybookStatus(prev => ({ ...prev, [id]: 'RUNNING' }));

    // Simulate execution time
    setTimeout(() => {
      setPlaybookStatus(prev => ({ ...prev, [id]: 'COMPLETED' }));
      
      // Reset after showing completion
      setTimeout(() => {
        setPlaybookStatus(prev => ({ ...prev, [id]: 'IDLE' }));
      }, 2000);
    }, 1500);
  };

  // Mock data generator for the selected member profile
  const getMemberDetails = (member: TeamMember) => {
    // Generate deterministic mock data based on name length
    const seed = member.name.length;
    
    return {
      tasks: [
        { id: '1', title: 'Review Database Logs', status: 'In Progress', priority: 'High', due: '2h' },
        { id: '2', title: 'Weekly Security Patching', status: 'Pending', priority: 'Medium', due: 'Tomorrow' },
        { id: '3', title: 'Update documentation for API', status: 'Completed', priority: 'Low', due: 'Yesterday' },
      ],
      workload: [
        { name: 'Incidents', value: Math.floor(member.load * 0.6), color: '#6366f1' }, // Indigo
        { name: 'Routine', value: Math.floor(member.load * 0.2), color: '#10b981' },   // Emerald
        { name: 'Meetings', value: Math.floor(member.load * 0.1), color: '#f59e0b' },  // Amber
        { name: 'Admin', value: Math.max(0, 100 - Math.floor(member.load * 0.9)), color: '#cbd5e1' } // Slate
      ],
      escalations: [
        { id: 'e1', to: 'L3 Engineering', role: 'System Architect', ticket: 'INC-2024-001', reason: 'Technical Complexity', date: '2 days ago' },
        { id: 'e2', to: 'Security Ops', role: 'SecLead', ticket: 'INC-2024-045', reason: 'Potential Breach', date: '1 week ago' },
        { id: 'e3', to: 'Vendor Support', role: 'AWS Premium', ticket: 'INC-2024-089', reason: 'Region Outage', date: '2 weeks ago' },
      ].slice(0, (seed % 3) + 1), // Randomize number of escalations based on name length
      schedule: {
        shift: '09:00 AM - 05:00 PM',
        timezone: 'EST (UTC-5)',
        location: 'Remote - New York',
        avgOnline: '7h 45m',
      },
      aiAnalysis: {
        effectiveness: member.load > 85 ? 'High Risk' : member.load < 50 ? 'Underutilized' : 'Optimal',
        summary: member.load > 80 
          ? `${member.name} is handling a high volume of complex tickets. Resolution speed is top tier, but burnout risk is detected due to sustained load above 80%.`
          : `${member.name} is maintaining a balanced workflow with excellent SLA compliance. Recommended for cross-training in Security modules.`,
        strengths: ['Rapid Triage', 'Documentation Quality', 'Stakeholder Comms'],
        improvements: member.load > 80 ? ['Delegate routine tasks', 'Schedule downtime'] : ['Increase L2 ticket volume', 'Lead a workshop']
      }
    };
  };

  const memberDetails = selectedMember ? getMemberDetails(selectedMember) : null;

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {role === UserRole.LEAD ? 'Team & Resources Console' : 'Knowledge Base & Escalation'}
        </h1>
        <p className="text-sm text-slate-500">
          {role === UserRole.LEAD 
            ? 'Monitor team availability, shift status, and workload.' 
            : 'Access Standard Operating Procedures (SOPs) and escalation paths.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* LEAD: Team Monitor */}
          {role === UserRole.LEAD && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Active Agents</CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs text-slate-500">3 Online</span>
                </div>
              </CardHeader>
              <div className="divide-y divide-slate-100">
                {MOCK_TEAM.map((member) => (
                  <div 
                    key={member.id} 
                    className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group/item"
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 group-hover/item:text-indigo-600 transition-colors">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-500">Load</p>
                        {/* Tooltip Container */}
                        <div className="relative group/tooltip">
                          <div className="w-24 h-2 bg-slate-100 rounded-full mt-1">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${member.load > 80 ? 'bg-red-500' : member.load > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${member.load}%` }}
                            ></div>
                          </div>
                          {/* Hover Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover/tooltip:block z-20">
                              <div className="bg-slate-800 text-white text-[10px] font-semibold rounded py-1 px-2 whitespace-nowrap shadow-lg">
                                  {member.load}% Capacity
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                              </div>
                          </div>
                        </div>
                      </div>
                      <Badge variant={member.status === 'ONLINE' ? 'success' : 'warning'}>
                        {member.status}
                      </Badge>
                      <button className="text-slate-400 hover:text-indigo-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* SHARED/AGENT: Playbooks */}
          <Card>
            <CardHeader className="border-b-0 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Standard Operating Procedures (SOPs)</CardTitle>
                <div className="relative w-48">
                   <Search className="absolute left-2 top-2 h-3 w-3 text-slate-400" />
                   <input className="pl-7 h-7 w-full text-xs rounded-md border border-slate-200" placeholder="Search SOPs..." />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_PLAYBOOKS.map((pb) => (
                  <div key={pb.id} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                         <div className="p-2 bg-indigo-50 rounded-md group-hover:bg-indigo-100">
                           <BookOpen className="h-5 w-5 text-indigo-600" />
                         </div>
                         <div>
                           <h4 className="text-sm font-semibold text-slate-900">{pb.title}</h4>
                           <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{pb.category}</span>
                         </div>
                      </div>
                      <Button 
                        variant={playbookStatus[pb.id] === 'COMPLETED' ? 'outline' : 'ghost'} 
                        size="sm" 
                        className={`transition-all duration-200 min-w-[80px] ${
                          playbookStatus[pb.id] === 'RUNNING' ? 'text-amber-600 bg-amber-50 cursor-wait' :
                          playbookStatus[pb.id] === 'COMPLETED' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                          'text-indigo-600 hover:bg-indigo-50'
                        }`}
                        onClick={(e) => handleRunPlaybook(pb.id, e)}
                        disabled={playbookStatus[pb.id] === 'RUNNING'}
                      >
                         {playbookStatus[pb.id] === 'RUNNING' ? (
                           <>
                             <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                             Running
                           </>
                         ) : playbookStatus[pb.id] === 'COMPLETED' ? (
                           <>
                             <Check className="h-3 w-3 mr-1.5" />
                             Done
                           </>
                         ) : (
                           "Run"
                         )}
                      </Button>
                    </div>
                    <div className="mt-3 pl-12">
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                         <GitMerge className="h-3 w-3" />
                         <span>{pb.steps.length} automated steps</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-slate-900">
            <CardHeader className="border-slate-800">
              <CardTitle className="text-slate-300">Escalation Path</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative">
                 {/* Connector Line */}
                 <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-700"></div>

                 <div className="relative flex items-start space-x-4">
                    <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center z-10 ring-4 ring-slate-900">
                       <span className="text-xs font-bold">L1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">NOC Agent</p>
                      <p className="text-xs text-slate-400">First response & triage</p>
                    </div>
                 </div>

                 <div className="relative flex items-start space-x-4">
                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center z-10 ring-4 ring-slate-900">
                       <span className="text-xs font-bold">L2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">SysAdmin On-Call</p>
                      <p className="text-xs text-slate-400">Response time: &lt; 15m</p>
                    </div>
                 </div>

                 <div className="relative flex items-start space-x-4">
                    <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center z-10 ring-4 ring-slate-900">
                       <span className="text-xs font-bold">L3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Engineering Lead</p>
                      <p className="text-xs text-slate-400">Critical failures only</p>
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
               <CardTitle>On-Call Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-4">
                 <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-amber-600" />
                 </div>
                 <div>
                    <p className="text-sm font-medium text-slate-900">Mike Chen</p>
                    <p className="text-xs text-slate-500">Primary L3 • Until 09:00 UTC</p>
                 </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">View Full Calendar</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Detail Modal */}
      {selectedMember && memberDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
          <div 
            className="absolute inset-0 backdrop-blur-sm" 
            onClick={() => setSelectedMember(null)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
             {/* Modal Header */}
             <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center space-x-4">
                   <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl ring-4 ring-white shadow-sm">
                      {selectedMember.name.charAt(0)}
                   </div>
                   <div>
                      <h2 className="text-lg font-bold text-slate-900">{selectedMember.name}</h2>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                         <span>{selectedMember.role}</span>
                         <span>•</span>
                         <Badge variant={selectedMember.status === 'ONLINE' ? 'success' : 'warning'}>{selectedMember.status}</Badge>
                      </div>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                   <X className="h-6 w-6" />
                </button>
             </div>

             {/* Modal Body */}
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* AI Analysis Section */}
                <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 rounded-lg p-5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <BrainCircuit className="h-24 w-24 text-indigo-600" />
                   </div>
                   <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                         <div className="p-1.5 bg-indigo-100 rounded-md">
                           <Sparkles className="h-4 w-4 text-indigo-600" />
                         </div>
                         <h3 className="font-bold text-indigo-900 text-sm">AI Performance Insights</h3>
                         <Badge variant={memberDetails.aiAnalysis.effectiveness === 'High Risk' ? 'destructive' : 'success'} className="ml-auto">
                            {memberDetails.aiAnalysis.effectiveness}
                         </Badge>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed mb-4">
                         {memberDetails.aiAnalysis.summary}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Strengths</span>
                            <ul className="mt-1 space-y-1">
                               {memberDetails.aiAnalysis.strengths.map((s, i) => (
                                  <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                                     <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {s}
                                  </li>
                               ))}
                            </ul>
                         </div>
                         <div>
                            <span className="text-[10px] font-bold uppercase text-amber-600 tracking-wider">Suggested Actions</span>
                            <ul className="mt-1 space-y-1">
                               {memberDetails.aiAnalysis.improvements.map((s, i) => (
                                  <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                                     <ArrowUpRight className="h-3 w-3 text-amber-500" /> {s}
                                  </li>
                               ))}
                            </ul>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Schedule & Availability */}
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-md border border-slate-200 shadow-sm">
                         <Clock className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                         <p className="text-[10px] font-medium text-slate-400 uppercase">Shift Hours</p>
                         <p className="text-sm font-semibold text-slate-900">{memberDetails.schedule.shift}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-md border border-slate-200 shadow-sm">
                         <Globe className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                         <p className="text-[10px] font-medium text-slate-400 uppercase">Timezone</p>
                         <p className="text-sm font-semibold text-slate-900">{memberDetails.schedule.timezone}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-md border border-slate-200 shadow-sm">
                         <MapPin className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                         <p className="text-[10px] font-medium text-slate-400 uppercase">Location</p>
                         <p className="text-sm font-semibold text-slate-900">{memberDetails.schedule.location}</p>
                      </div>
                   </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                   <div className="p-4 rounded-lg bg-white border border-slate-100 text-center shadow-sm">
                      <div className="text-xs text-slate-500 mb-1">Current Load</div>
                      <div className={`text-2xl font-bold ${selectedMember.load > 80 ? 'text-red-600' : 'text-slate-900'}`}>{selectedMember.load}%</div>
                   </div>
                   <div className="p-4 rounded-lg bg-white border border-slate-100 text-center shadow-sm">
                      <div className="text-xs text-slate-500 mb-1">Avg Online</div>
                      <div className="text-2xl font-bold text-emerald-600">{memberDetails.schedule.avgOnline}</div>
                   </div>
                   <div className="p-4 rounded-lg bg-white border border-slate-100 text-center shadow-sm">
                      <div className="text-xs text-slate-500 mb-1">Tickets Closed</div>
                      <div className="text-2xl font-bold text-indigo-600">8</div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Workload Chart */}
                    <div className="space-y-3">
                       <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                          <BarChart3 className="h-4 w-4 text-slate-400" />
                          Workload Distribution
                       </h3>
                       <div className="h-48 w-full border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                          <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                <Pie
                                   data={memberDetails.workload}
                                   cx="50%"
                                   cy="50%"
                                   innerRadius={40}
                                   outerRadius={60}
                                   paddingAngle={5}
                                   dataKey="value"
                                >
                                   {memberDetails.workload.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                   ))}
                                </Pie>
                                <RechartsTooltip 
                                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                                  itemStyle={{ color: '#fff' }}
                                />
                             </PieChart>
                          </ResponsiveContainer>
                       </div>
                       {/* Enhanced Legend */}
                       <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
                          {memberDetails.workload.map(item => (
                             <div key={item.name} className="flex items-center gap-2 p-1.5 rounded bg-slate-50">
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-700 leading-none">{item.name}</span>
                                    <span className="text-slate-500">{item.value}%</span>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* Active Tasks */}
                    <div className="space-y-3">
                       <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                          <Briefcase className="h-4 w-4 text-slate-400" />
                          Current Assignments
                       </h3>
                       <div className="space-y-2">
                          {memberDetails.tasks.map(task => (
                             <div key={task.id} className="p-3 border border-slate-100 rounded-lg hover:border-indigo-100 transition-colors bg-white shadow-sm">
                                <div className="flex justify-between items-start">
                                   <div className="font-medium text-sm text-slate-800 line-clamp-1" title={task.title}>{task.title}</div>
                                   <Badge variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'warning' : 'default'} className="scale-90 flex-shrink-0">{task.priority}</Badge>
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                   <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Due: {task.due}</span>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                </div>

                 {/* New Escalations History Section */}
                 <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h3 className="font-semibold text-slate-900 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <ArrowUpRight className="h-4 w-4 text-slate-400" />
                            Recent Escalations
                        </div>
                        <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Last 30 days</span>
                    </h3>
                    <div className="space-y-2">
                        {memberDetails.escalations.length > 0 ? (
                            memberDetails.escalations.map(esc => (
                                <div key={esc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm gap-2">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-700">To: {esc.to}</span>
                                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold bg-white border border-slate-200 px-1.5 rounded">{esc.role}</span>
                                        </div>
                                        <span className="text-xs text-slate-500 mt-0.5">Reason: {esc.reason}</span>
                                    </div>
                                    <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0 justify-between sm:justify-center">
                                         <div className="text-indigo-600 font-mono text-xs font-medium bg-indigo-50 px-1.5 py-0.5 rounded">{esc.ticket}</div>
                                         <div className="text-xs text-slate-400 sm:mt-1">{esc.date}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-sm text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
                                No escalations recorded recently.
                            </div>
                        )}
                    </div>
                 </div>

                {/* Skills */}
                <div className="space-y-2 pt-2">
                   <h3 className="font-semibold text-slate-900 text-sm">Skills & Certifications</h3>
                   <div className="flex flex-wrap gap-2">
                      {selectedMember.skills.map(skill => (
                         <span key={skill} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                            {skill}
                         </span>
                      ))}
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                         AWS Certified
                      </span>
                   </div>
                </div>
             </div>
             
             {/* Footer */}
             <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedMember(null)}>Close</Button>
                <Button variant="primary">Manage Allocation</Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;