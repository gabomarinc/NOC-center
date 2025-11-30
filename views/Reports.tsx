
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Tooltip } from '../components/ui';
import { FileText, Download, Calendar, Share2, ArrowLeft, Info, Sparkles, CheckCircle2, AlertTriangle, TrendingUp, BarChart3, PieChart as PieIcon, RefreshCw, Trophy, Target, BookOpen, ThumbsUp, Medal, Bot, Coins, Server } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { UserRole } from '../types';

// --- Types & Mock Data for Reports ---

interface ReportData {
  id: string;
  name: string;
  date: string;
  size: string;
  type: 'SLA' | 'INCIDENT' | 'EXECUTIVE' | 'SECURITY' | 'ROI' | 'CAPACITY';
  metrics: { label: string; value: string; trend: 'up' | 'down' | 'neutral'; description: string }[];
  chartData: any[];
}

const MOCK_REPORTS: ReportData[] = [
  { 
    id: 'r1', 
    name: 'Weekly SLA Performance', 
    date: 'May 15, 2024', 
    size: '2.4 MB', 
    type: 'SLA',
    metrics: [
      { label: 'Uptime', value: '99.98%', trend: 'up', description: 'Percentage of time services were available across all regions.' },
      { label: 'Avg Response', value: '4m 12s', trend: 'down', description: 'Average time taken for L1 agents to acknowledge a new ticket.' },
      { label: 'SLA Breaches', value: '2', trend: 'neutral', description: 'Total number of tickets that exceeded the agreed Service Level Agreement time.' }
    ],
    chartData: [
      { name: 'Mon', uptime: 99.9, response: 5 },
      { name: 'Tue', uptime: 99.8, response: 8 },
      { name: 'Wed', uptime: 99.99, response: 4 },
      { name: 'Thu', uptime: 99.95, response: 3 },
      { name: 'Fri', uptime: 99.7, response: 12 },
      { name: 'Sat', uptime: 100, response: 2 },
      { name: 'Sun', uptime: 100, response: 2 },
    ]
  },
  { 
    id: 'r2', 
    name: 'Incident Post-Mortem: #INC-001', 
    date: 'May 14, 2024', 
    size: '1.1 MB', 
    type: 'INCIDENT',
    metrics: [
      { label: 'Downtime', value: '45m', trend: 'neutral', description: 'Total duration of service interruption from detection to resolution.' },
      { label: 'Impacted Users', value: '2,400', trend: 'neutral', description: 'Estimated number of active users affected during the incident window.' },
      { label: 'Root Cause', value: 'DB Lock', trend: 'neutral', description: 'Primary technical reason identified for the system failure.' }
    ],
    chartData: [
      { name: '10:00', load: 20 },
      { name: '10:15', load: 45 },
      { name: '10:30', load: 100 }, // Spike
      { name: '10:45', load: 80 },
      { name: '11:00', load: 30 },
      { name: '11:15', load: 25 },
    ]
  },
  { 
    id: 'r3', 
    name: 'Monthly Executive Summary', 
    date: 'May 01, 2024', 
    size: '4.8 MB', 
    type: 'EXECUTIVE',
    metrics: [
      { label: 'Total Tickets', value: '450', trend: 'up', description: 'Total volume of support requests received across all channels.' },
      { label: 'CSAT Score', value: '4.8/5', trend: 'up', description: 'Customer Satisfaction Score aggregated from post-resolution surveys.' },
      { label: 'Auto-Resolution', value: '35%', trend: 'up', description: 'Percentage of tickets resolved purely by AI or automated playbooks.' }
    ],
    chartData: [
      { name: 'Week 1', tickets: 120, resolved: 110 },
      { name: 'Week 2', tickets: 98, resolved: 95 },
      { name: 'Week 3', tickets: 140, resolved: 130 },
      { name: 'Week 4', tickets: 92, resolved: 92 },
    ]
  },
  { 
    id: 'r4', 
    name: 'Security Audit Q1', 
    date: 'Apr 15, 2024', 
    size: '12 MB', 
    type: 'SECURITY',
    metrics: [
      { label: 'Vulnerabilities', value: '12', trend: 'down', description: 'Number of open vulnerabilities detected in the latest infrastructure scan.' },
      { label: 'Threats Blocked', value: '14k', trend: 'up', description: 'Total malicious attempts blocked by the Web Application Firewall (WAF).' },
      { label: 'Compliance', value: '100%', trend: 'neutral', description: 'Current adherence status to SOC2 and ISO27001 standards.' }
    ],
    chartData: [
      { name: 'Jan', attacks: 4000 },
      { name: 'Feb', attacks: 3500 },
      { name: 'Mar', attacks: 6500 },
    ]
  },
  {
    id: 'r5',
    name: 'ROI & Operational Efficiency',
    date: 'May 20, 2024',
    size: '3.2 MB',
    type: 'ROI',
    metrics: [
      { label: 'Est. Cost Savings', value: '$14,500', trend: 'up', description: 'Savings calculated based on automated ticket resolution vs. human agent hourly cost.' },
      { label: 'DevOps Hours Saved', value: '120h', trend: 'up', description: 'Engineering hours redirected from maintenance to feature development.' },
      { label: 'Tool Consolidation', value: '3', trend: 'neutral', description: 'Number of redundant monitoring tools deprecated this quarter.' }
    ],
    chartData: [
      { name: 'Q1', manual_cost: 50000, automated_cost: 35000 },
      { name: 'Q2', manual_cost: 52000, automated_cost: 32000 },
      { name: 'Q3 (Proj)', manual_cost: 55000, automated_cost: 30000 },
    ]
  },
  {
    id: 'r6',
    name: 'Infrastructure Capacity Forecast',
    date: 'May 18, 2024',
    size: '5.5 MB',
    type: 'CAPACITY',
    metrics: [
      { label: 'Peak CPU Util', value: '78%', trend: 'up', description: 'Highest CPU usage recorded across the fleet during peak traffic windows.' },
      { label: 'Storage Runway', value: '4 Months', trend: 'down', description: 'Estimated time until current storage allocation reaches 90% capacity.' },
      { label: 'Rec. Action', value: 'Scale DB', trend: 'neutral', description: 'Primary recommendation to avoid bottlenecks in the next quarter.' }
    ],
    chartData: [
      { name: 'Jan', usage: 45, limit: 100 },
      { name: 'Feb', usage: 55, limit: 100 },
      { name: 'Mar', usage: 60, limit: 100 },
      { name: 'Apr', usage: 72, limit: 100 },
      { name: 'May', usage: 78, limit: 100 },
      { name: 'Jun (Est)', usage: 85, limit: 100 },
    ]
  }
];

// Mock Data for Agent Performance View
const AGENT_STATS = {
  qualityScore: 92,
  ticketsResolved: 45,
  avgHandleTime: 18, // mins
  csat: 4.9,
  skills: [
    { subject: 'Technical', A: 120, fullMark: 150 },
    { subject: 'Speed', A: 98, fullMark: 150 },
    { subject: 'Comms', A: 86, fullMark: 150 },
    { subject: 'Process', A: 99, fullMark: 150 },
    { subject: 'Security', A: 85, fullMark: 150 },
    { subject: 'Tools', A: 65, fullMark: 150 },
  ],
  recentFeedback: [
    { id: 1, text: "Excellent handling of the database migration issue!", author: "Mike (Lead)", type: "positive" },
    { id: 2, text: "Remember to update the ticket tags before closing.", author: "System Bot", type: "neutral" }
  ]
};

interface ReportsProps {
  role?: UserRole;
}

const Reports: React.FC<ReportsProps> = ({ role = UserRole.LEAD }) => {
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{summary: string; actions: string[]} | null>(null);

  // --- AGENT VIEW ---
  if (role === UserRole.AGENT) {
    // ... (Keep existing Agent view code unchanged) ...
    return (
      <div className="space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Performance</h1>
          <p className="text-sm text-slate-500">Track your metrics, quality scores, and areas for growth.</p>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <Card className="bg-white border-l-4 border-l-indigo-500">
              <CardContent className="p-4">
                 <div className="text-xs font-medium text-slate-500 uppercase">Quality Score</div>
                 <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{AGENT_STATS.qualityScore}</span>
                    <span className="text-sm text-emerald-600 font-medium flex items-center"><TrendingUp className="h-3 w-3 mr-1"/> +2%</span>
                 </div>
              </CardContent>
           </Card>
           <Card className="bg-white border-l-4 border-l-emerald-500">
              <CardContent className="p-4">
                 <div className="text-xs font-medium text-slate-500 uppercase">Tickets Resolved</div>
                 <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{AGENT_STATS.ticketsResolved}</span>
                    <span className="text-xs text-slate-400">This Week</span>
                 </div>
              </CardContent>
           </Card>
           <Card className="bg-white border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                 <div className="text-xs font-medium text-slate-500 uppercase">Avg Handle Time</div>
                 <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{AGENT_STATS.avgHandleTime}m</span>
                    <span className="text-sm text-emerald-600 font-medium">-2m vs Team</span>
                 </div>
              </CardContent>
           </Card>
           <Card className="bg-white border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                 <div className="text-xs font-medium text-slate-500 uppercase">CSAT Score</div>
                 <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{AGENT_STATS.csat}</span>
                    <div className="flex text-amber-400">
                       <Sparkles className="h-4 w-4 fill-current" />
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Skill Radar */}
           <Card className="lg:col-span-1">
              <CardHeader>
                 <CardTitle>Skill Proficiency</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                 <div className="h-[300px] w-full max-w-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart cx="50%" cy="50%" outerRadius="80%" data={AGENT_STATS.skills}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                          <Radar
                             name="My Skills"
                             dataKey="A"
                             stroke="#6366f1"
                             strokeWidth={2}
                             fill="#6366f1"
                             fillOpacity={0.5}
                          />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                       </RadarChart>
                    </ResponsiveContainer>
                 </div>
              </CardContent>
           </Card>

           {/* Coaching & AI Analysis */}
           <Card className="lg:col-span-2 flex flex-col">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-indigo-600" /> AI Coach Suggestions
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 flex-1">
                 <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                       <div className="p-2 bg-white rounded-full shadow-sm">
                          <Bot className="h-5 w-5 text-indigo-600" />
                       </div>
                       <div>
                          <p className="text-sm font-semibold text-indigo-900">Focus Area: Tool Proficiency</p>
                          <p className="text-sm text-indigo-800 mt-1">
                             Your resolution times are excellent, but you are underutilizing the new "Log Analyzer 2.0". Using this tool could reduce your Average Handle Time by another 15%.
                          </p>
                          <Button size="sm" className="mt-3 bg-indigo-600 text-white hover:bg-indigo-700">View Tool Tutorial</Button>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Recent Achievements</h3>
                    <div className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                       <div className="p-2 bg-amber-100 text-amber-600 rounded-full">
                          <Medal className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="text-sm font-medium text-slate-900">SLA Crusher</p>
                          <p className="text-xs text-slate-500">Zero SLA breaches for 14 consecutive days.</p>
                       </div>
                    </div>
                     <div className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                       <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                          <ThumbsUp className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="text-sm font-medium text-slate-900">Customer Favorite</p>
                          <p className="text-xs text-slate-500">Received 5/5 stars on 10 tickets this week.</p>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    );
  }

  // --- LEAD & CLIENT VIEW ---

  const handleOpenReport = (report: ReportData) => {
    setSelectedReport(report);
    setAiResult(null); // Reset AI state
  };

  const handleGenerateAI = () => {
    setAiLoading(true);
    // Simulate AI Latency
    setTimeout(() => {
      let analysis = { summary: '', actions: [] as string[] };
      
      if (selectedReport?.type === 'SLA') {
        analysis = {
          summary: "Overall SLA adherence is strong at 99.98%, however, Friday showed a significant spike in response times (12m) correlating with the 'Database Latency' incident. The weekend recovery was optimal.",
          actions: ["Investigate Friday's shift scheduling gaps to improve response times.", "Review database auto-scaling triggers to prevent recurrence of latency events."]
        };
      } else if (selectedReport?.type === 'ROI') {
        analysis = {
            summary: "Automation strategies have successfully deflected 35% of L1 tickets this quarter, resulting in an estimated $14,500 cost avoidance. Engineering time has been effectively reallocated to product development.",
            actions: ["Expand automation to L2 database reset tasks to capture another 10% efficiency.", "Review tool consolidation opportunities to further reduce SaaS spend."]
        };
      } else if (selectedReport?.type === 'CAPACITY') {
          analysis = {
              summary: "CPU utilization is trending upwards and will likely breach safe thresholds (85%) by mid-June based on current growth. Storage is sufficient for 4 months.",
              actions: ["Schedule vertical scaling of primary DB instance during next maintenance window.", "Implement archival policy for logs older than 90 days to reclaim storage."]
          };
      } else {
        analysis = {
          summary: "Metrics indicate a healthy upward trend in performance. Variance correlates with expected load patterns. The team handled the recent surge with minimal impact on end-user latency.",
          actions: ["Maintain current operational posture.", "Prepare capacity for upcoming holiday season traffic."]
        };
      }

      setAiResult(analysis);
      setAiLoading(false);
    }, 2500);
  };

  const handleAction = (action: string) => {
    alert(`[Simulation] ${action}`);
  };

  // Filter Reports for Clients
  const displayReports = role === UserRole.CLIENT 
    ? MOCK_REPORTS.filter(r => ['SLA', 'EXECUTIVE', 'ROI', 'CAPACITY'].includes(r.type)) 
    : MOCK_REPORTS;

  // --- REPORT DETAIL VIEW ---
  if (selectedReport) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-10">
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setSelectedReport(null)} className="p-2 h-auto text-slate-500 hover:text-indigo-600">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{selectedReport.name}</h1>
              <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Generated: {selectedReport.date}</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono border border-slate-200">{selectedReport.size}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
             <Tooltip content="Share report link via email">
               <Button variant="outline" onClick={() => handleAction('Shared via Email')}>
                 <Share2 className="h-4 w-4 mr-2" /> Share
               </Button>
             </Tooltip>
             <Tooltip content="Download generic PDF format">
               <Button variant="primary" onClick={() => handleAction('Downloading PDF...')}>
                 <Download className="h-4 w-4 mr-2" /> Export PDF
               </Button>
             </Tooltip>
          </div>
        </div>

        {/* Report Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Visuals (Left Col) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               {selectedReport.metrics.map((metric, i) => (
                 <Card key={i} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                   <CardContent className="p-4 flex flex-col justify-between h-full">
                      <div className="flex items-start justify-between">
                         <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                           {metric.label}
                           <Tooltip content={metric.description}>
                              <Info className="h-3.5 w-3.5 text-slate-300 hover:text-indigo-600 cursor-help transition-colors" />
                           </Tooltip>
                         </span>
                         {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                         {metric.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
                         {metric.trend === 'neutral' && <TrendingUp className="h-4 w-4 text-slate-300 rotate-90" />}
                      </div>
                      <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">{metric.value}</div>
                   </CardContent>
                 </Card>
               ))}
            </div>

            {/* Main Chart */}
            <Card>
               <CardHeader>
                 <CardTitle>Data Visualization</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       {selectedReport.type === 'ROI' ? (
                          <AreaChart data={selectedReport.chartData}>
                             <defs>
                              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="manual_cost" stackId="1" stroke="#cbd5e1" fill="#f1f5f9" name="Manual Cost" />
                            <Area type="monotone" dataKey="automated_cost" stackId="2" stroke="#10b981" fill="url(#colorCost)" name="Automated Cost" />
                            <Legend />
                          </AreaChart>
                       ) : selectedReport.type === 'CAPACITY' ? (
                           <AreaChart data={selectedReport.chartData}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                             <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 110]} />
                             <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                             <Area type="step" dataKey="limit" stroke="#ef4444" strokeDasharray="5 5" fill="transparent" name="Capacity Limit" />
                             <Area type="monotone" dataKey="usage" stroke="#6366f1" fill="#e0e7ff" name="Resource Usage" />
                             <Legend />
                           </AreaChart>
                       ) : selectedReport.type === 'EXECUTIVE' ? (
                          <BarChart data={selectedReport.chartData}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                             <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                             <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                             <Legend />
                             <Bar dataKey="tickets" name="Total Tickets" fill="#6366f1" radius={[4, 4, 0, 0]} />
                             <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                       ) : (
                          <AreaChart data={selectedReport.chartData}>
                            <defs>
                              <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey={Object.keys(selectedReport.chartData[0])[1]} stroke="#6366f1" fillOpacity={1} fill="url(#colorMain)" />
                          </AreaChart>
                       )}
                    </ResponsiveContainer>
                 </div>
               </CardContent>
            </Card>
          </div>

          {/* AI Analysis (Right Col) */}
          <div className="space-y-6">
            <Card className="border-indigo-200 bg-gradient-to-b from-indigo-50/50 to-white overflow-hidden shadow-sm">
               <CardHeader className="bg-indigo-50 border-b border-indigo-100 pb-3">
                  <div className="flex items-center gap-2">
                     <Sparkles className="h-5 w-5 text-indigo-600" />
                     <CardTitle className="text-indigo-900">AI Report Analyzer</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="pt-6">
                  {!aiResult ? (
                    <div className="text-center py-8">
                       <div className="mb-4 flex justify-center">
                          <div className="bg-indigo-100 p-3 rounded-full">
                            <RefreshCw className={`h-8 w-8 text-indigo-500 ${aiLoading ? 'animate-spin' : ''}`} />
                          </div>
                       </div>
                       <h3 className="text-sm font-semibold text-slate-900 mb-2">Automated Insights</h3>
                       <p className="text-xs text-slate-500 mb-6 px-4">Generate an executive summary and actionable suggestions based on this report's dataset.</p>
                       <Button 
                        onClick={handleGenerateAI} 
                        disabled={aiLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                       >
                         {aiLoading ? (
                           <span className="flex items-center gap-2">
                             Analyzing Data...
                           </span>
                         ) : (
                           "Generate AI Insights"
                         )}
                       </Button>
                    </div>
                  ) : (
                    <div className="space-y-5 animate-in fade-in zoom-in duration-300">
                       <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-2">
                            <FileText className="h-3 w-3" /> Executive Resume
                          </h4>
                          <p className="text-sm text-slate-700 leading-relaxed bg-white/50 p-3 rounded-lg border border-indigo-50">
                            {aiResult.summary}
                          </p>
                       </div>
                       
                       <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3" /> Suggestions
                          </h4>
                          <ul className="space-y-2">
                            {aiResult.actions.map((action, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-100 shadow-sm">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 shadow-sm shadow-emerald-200"></span>
                                {action}
                              </li>
                            ))}
                          </ul>
                       </div>

                       <div className="pt-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setAiResult(null)}
                            className="w-full text-indigo-600 hover:text-indigo-700 text-xs border border-dashed border-indigo-200 hover:bg-indigo-50"
                          >
                            Generate New Analysis
                          </Button>
                       </div>
                    </div>
                  )}
               </CardContent>
            </Card>

            {/* Meta Info */}
            <Card>
              <CardContent className="p-4 space-y-3">
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Author</span>
                    <span className="font-medium text-slate-900">System Auto-Gen</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Data Source</span>
                    <span className="font-medium text-slate-900">Prometheus / CloudWatch</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Classification</span>
                    <Badge variant="outline" className="text-[10px] h-5">Confidential</Badge>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
           {role === UserRole.CLIENT ? 'Strategic & Operational Reports' : 'Reports Repository'}
        </h1>
        <p className="text-sm text-slate-500">
          {role === UserRole.CLIENT 
            ? 'Executive summaries, ROI analysis, and capacity forecasting.' 
            : 'Access automated performance and incident reports'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayReports.map((report) => (
          <Card 
            key={report.id} 
            className="hover:shadow-lg hover:border-indigo-300 transition-all duration-200 cursor-pointer border-l-4 border-l-indigo-500 group"
            onClick={() => handleOpenReport(report)}
          >
             <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                   <div className="p-2.5 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors shadow-sm">
                      {report.type === 'SLA' && <BarChart3 className="h-6 w-6 text-indigo-600" />}
                      {report.type === 'INCIDENT' && <AlertTriangle className="h-6 w-6 text-amber-600" />}
                      {report.type === 'EXECUTIVE' && <PieIcon className="h-6 w-6 text-emerald-600" />}
                      {report.type === 'SECURITY' && <FileText className="h-6 w-6 text-slate-600" />}
                      {report.type === 'ROI' && <Coins className="h-6 w-6 text-emerald-600" />}
                      {report.type === 'CAPACITY' && <Server className="h-6 w-6 text-indigo-600" />}
                   </div>
                   {role === UserRole.LEAD && (
                      <div className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                         <Download className="h-4 w-4" />
                      </div>
                   )}
                </div>
                <h3 className="font-semibold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{report.name}</h3>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                   <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {report.date}</span>
                   <span className="bg-slate-100 px-2.5 py-1 rounded-md font-mono border border-slate-200">{report.size}</span>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
