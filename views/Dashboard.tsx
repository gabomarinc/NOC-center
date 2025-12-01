
import React, { useMemo } from 'react';
import { UserRole } from '../types';
import { MOCK_METRICS, MOCK_CHART_DATA, MOCK_CLIENT_SERVICES, MOCK_CLIENT_REGIONS } from '../constants';
import { useData } from '../hooks/useData';
import { Card, CardContent, CardHeader, CardTitle, Badge, Tooltip } from '../components/ui';
import { TrendingUp, TrendingDown, Minus, Clock, CheckCircle2, AlertTriangle, ShieldCheck, Globe, Activity, Server, Zap, AlertCircle, BarChart3, Users, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

interface DashboardProps {
  role: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  // Connect to Data Layer (Supabase or Mock)
  const { incidents, team, loading } = useData();

  // --- Dynamic Metrics Calculation ---
  const dynamicMetrics = useMemo(() => {
    // Clone defaults
    const metrics = [...MOCK_METRICS[role]];

    // If loading or no data, return defaults
    if (loading) return metrics;

    // Calculate Real-time Counts based on fetched Incidents
    const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length;
    const openCount = incidents.filter(i => i.status === 'OPEN').length;
    const resolvedToday = incidents.filter(i => i.status === 'RESOLVED').length; // Simplified for demo
    
    // Calculate Team Stats
    const onlineAgents = team.filter(t => t.status === 'ONLINE').length;
    const teamLoadAvg = team.length > 0 ? Math.round(team.reduce((acc, curr) => acc + curr.load, 0) / team.length) : 0;

    if (role === UserRole.LEAD) {
       // Update 'Critical Incidents'
       metrics[1] = { ...metrics[1], value: criticalCount, trend: criticalCount > 0 ? 'up' : 'down' };
       // Update 'Team Load'
       metrics[0] = { ...metrics[0], value: `${teamLoadAvg}%`, trend: teamLoadAvg > 80 ? 'up' : 'neutral' };
    } else if (role === UserRole.AGENT) {
       // Update 'My Open Tickets' (Simulated as global open for demo)
       metrics[0] = { ...metrics[0], value: openCount };
       // Update 'Tasks Completed'
       metrics[2] = { ...metrics[2], value: resolvedToday };
    }

    return metrics;
  }, [role, incidents, team, loading]);


  // --- CLIENT DASHBOARD: Executive Command Center ---
  if (role === UserRole.CLIENT) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* 1. Hero Status Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">All Systems Operational</h1>
              <p className="text-emerald-100 font-medium opacity-90">No critical incidents detected in the last 24 hours.</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-white/10 px-4 py-2 rounded-lg text-center backdrop-blur-sm">
                <div className="text-xs text-emerald-100 uppercase tracking-wide">Global Latency</div>
                <div className="text-xl font-bold">42ms</div>
             </div>
             <div className="bg-white/10 px-4 py-2 rounded-lg text-center backdrop-blur-sm">
                <div className="text-xs text-emerald-100 uppercase tracking-wide">Error Rate</div>
                <div className="text-xl font-bold">0.00%</div>
             </div>
          </div>
        </div>

        {/* 2. Key Business Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {dynamicMetrics.map((metric, idx) => (
            <Card key={idx} className="border-l-4 border-l-indigo-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">{metric.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{metric.value}</p>
                  </div>
                  <div className={`p-1.5 rounded ${metric.trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                </div>
                {metric.change !== undefined && (
                  <p className="text-xs text-slate-500 mt-2">
                    <span className="text-emerald-600 font-medium">{metric.change > 0 ? '+' : ''}{metric.change}%</span> vs last week
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* 3. Service Component Health Matrix */}
           <div className="lg:col-span-2 space-y-6">
              <Card>
                 <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="flex items-center gap-2">
                       <Server className="h-5 w-5 text-indigo-600" />
                       Service Component Health
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">Real-time</Badge>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       <div className="grid grid-cols-12 text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100 pb-2">
                          <div className="col-span-4">Service Name</div>
                          <div className="col-span-3">Status</div>
                          <div className="col-span-2 text-right">Uptime (30d)</div>
                          <div className="col-span-3 text-right">Latency</div>
                       </div>
                       {MOCK_CLIENT_SERVICES.map((service, i) => (
                          <div key={i} className="grid grid-cols-12 items-center text-sm py-2 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors">
                             <div className="col-span-4 font-medium text-slate-900 flex items-center gap-2">
                                {service.name}
                             </div>
                             <div className="col-span-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                   service.status === 'Operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                   <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                      service.status === 'Operational' ? 'bg-emerald-500' : 'bg-amber-500'
                                   }`}></span>
                                   {service.status}
                                </span>
                             </div>
                             <div className="col-span-2 text-right text-slate-600 font-mono">{service.uptime}</div>
                             <div className="col-span-3 text-right font-medium text-slate-700">{service.latency}</div>
                          </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>

              {/* Traffic Visualization */}
              <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <Activity className="h-5 w-5 text-indigo-600" />
                       Traffic & Latency Trends
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="h-[250px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={MOCK_CHART_DATA}>
                             <defs>
                                <linearGradient id="colorClientVal" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                   <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                             <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                             <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                             <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorClientVal)" name="Requests (M)" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </CardContent>
              </Card>
           </div>

           {/* 4. Regional & Security Info */}
           <div className="lg:col-span-1 space-y-6">
              {/* Regional Status */}
              <Card className="bg-slate-900 text-white border-slate-800">
                 <CardHeader>
                    <CardTitle className="text-slate-200 flex items-center gap-2">
                       <Globe className="h-5 w-5 text-indigo-400" />
                       Regional Performance
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       {MOCK_CLIENT_REGIONS.map((region, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                             <div>
                                <div className="text-sm font-medium text-slate-200">{region.name}</div>
                                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                   <Zap className="h-3 w-3" /> {region.latency}ms latency
                                </div>
                             </div>
                             <div className={`px-2 py-1 rounded text-xs font-bold ${
                                region.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                             }`}>
                                {region.status}
                             </div>
                          </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
              
              {/* Security Snapshot */}
              <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <ShieldCheck className="h-5 w-5 text-emerald-600" />
                       Security Posture
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">DDoS Protection</span>
                          <Badge variant="success">Active</Badge>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">WAF Status</span>
                          <Badge variant="success">Monitoring</Badge>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">SSL Certificates</span>
                          <span className="text-xs text-slate-500">Valid (240 days)</span>
                       </div>
                       <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="text-xs font-medium text-slate-500 uppercase mb-1">Threats Blocked (24h)</div>
                          <div className="text-xl font-bold text-slate-900">1,240</div>
                       </div>
                    </div>
                 </CardContent>
              </Card>

              {/* Recent Alerts */}
              <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <AlertCircle className="h-5 w-5 text-slate-600" />
                       Recent Alerts
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <ul className="space-y-3">
                       <li className="text-sm border-l-2 border-amber-400 pl-3">
                          <p className="font-medium text-slate-800">Search Service Degraded</p>
                          <p className="text-xs text-slate-500">EU-West • 2 hours ago</p>
                       </li>
                       <li className="text-sm border-l-2 border-emerald-400 pl-3">
                          <p className="font-medium text-slate-800">Scheduled Maintenance Complete</p>
                          <p className="text-xs text-slate-500">US-East • 5 hours ago</p>
                       </li>
                    </ul>
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    );
  }

  // --- INTERNAL DASHBOARD (Lead/Agent) ---
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Operations Overview
          </h1>
          {loading && <p className="text-xs text-indigo-500 flex items-center gap-1 mt-1"><Loader2 className="h-3 w-3 animate-spin"/> Syncing live data...</p>}
        </div>
        <div className="text-sm text-slate-500">Last updated: Just now</div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dynamicMetrics.map((metric, idx) => (
          <Card key={idx}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 truncate">{metric.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{metric.value}</p>
                </div>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  metric.trend === 'up' ? 'bg-indigo-50 text-indigo-600' : 
                  metric.trend === 'down' ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-600'
                }`}>
                  {metric.trend === 'up' && <TrendingUp className="w-5 h-5" />}
                  {metric.trend === 'down' && <TrendingDown className="w-5 h-5" />}
                  {metric.trend === 'neutral' && <Minus className="w-5 h-5" />}
                </div>
              </div>
              {metric.change !== undefined && (
                <div className="mt-2 flex items-center text-sm">
                  <span className={`${metric.change >= 0 ? 'text-emerald-600' : 'text-red-600'} font-medium`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="ml-2 text-slate-400">from last week</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Incident Volume & Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_CHART_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="value2" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Role Specific Feed/Info */}
        <Card>
          <CardHeader>
            <CardTitle>{role === UserRole.LEAD ? 'Live Risks' : 'My Shift'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {role === UserRole.LEAD && (
                <>
                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">SLA Breach Imminent</p>
                      <p className="text-xs text-red-600 mt-1">Ticket #402 is 5m from breach. Escalation needed.</p>
                    </div>
                  </div>
                   <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Shift Handover</p>
                      <p className="text-xs text-amber-600 mt-1">US East shift ends in 45 minutes.</p>
                    </div>
                  </div>
                </>
              )}

              {role === UserRole.AGENT && (
                 <>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">Tickets Closed</span>
                    <span className="text-lg font-bold text-slate-900">12</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">CSAT Score</span>
                    <span className="text-lg font-bold text-emerald-600 flex items-center gap-1">4.9 <span className="text-xs font-normal text-slate-400">/ 5.0</span></span>
                  </div>
                  <div className="p-3 border border-dashed border-slate-300 rounded-lg text-center">
                     <p className="text-xs text-slate-500 mb-2">Next Scheduled Break</p>
                     <p className="font-mono text-sm font-semibold text-slate-700">14:00 (in 25m)</p>
                  </div>
                 </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
