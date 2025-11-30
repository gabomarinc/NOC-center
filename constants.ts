
import { UserRole, Incident, Metric, ChartData, User, TeamMember, Playbook } from './types';

export const MOCK_USERS: Record<UserRole, User> = {
  [UserRole.LEAD]: {
    id: 'u1',
    name: 'Sarah Connor (Lead)',
    role: UserRole.LEAD,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
    email: 'sarah@noc-command.com'
  },
  [UserRole.AGENT]: {
    id: 'u2',
    name: 'John Doe (Agent)',
    role: UserRole.AGENT,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=c0aede',
    email: 'john@noc-command.com'
  },
  [UserRole.CLIENT]: {
    id: 'u3',
    name: 'Acme Corp (Client)',
    role: UserRole.CLIENT,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AC&backgroundColor=ffdfbf',
    email: 'admin@acmecorp.com'
  }
};

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-2024-001',
    title: 'Database Latency Spike - US East',
    status: 'CRITICAL',
    severity: 'CRITICAL',
    createdAt: '2024-05-20T10:30:00Z',
    assignee: 'John Doe',
    description: 'High latency observed in primary RDS cluster. Automatic failover triggered but read replicas lagging.',
    tags: ['Database', 'AWS', 'Latency']
  },
  {
    id: 'INC-2024-002',
    title: 'Payment Gateway Timeout',
    status: 'IN_PROGRESS',
    severity: 'HIGH',
    createdAt: '2024-05-20T11:15:00Z',
    assignee: 'Sarah Connor',
    description: 'Stripe API webhooks failing with 504 errors. Investigating inbound firewall rules.',
    tags: ['Billing', 'API', 'Network']
  },
  {
    id: 'INC-2024-003',
    title: 'Frontend Asset 404s',
    status: 'OPEN',
    severity: 'MEDIUM',
    createdAt: '2024-05-20T12:00:00Z',
    description: 'CDN cache invalidation issue causing intermittent 404s on static assets.',
    tags: ['CDN', 'Frontend']
  },
  {
    id: 'INC-2024-004',
    title: 'Internal VPN Connectivity',
    status: 'RESOLVED',
    severity: 'LOW',
    createdAt: '2024-05-19T09:00:00Z',
    assignee: 'John Doe',
    description: 'Certificate expired on VPN node 3. Renewed and deployed.',
    tags: ['Internal', 'Security']
  },
  {
    id: 'INC-2024-005',
    title: 'Email Delivery Delay',
    status: 'RESOLVED',
    severity: 'MEDIUM',
    createdAt: '2024-05-18T14:20:00Z',
    assignee: 'Auto-Bot',
    description: 'SMTP relay queue buildup due to spam filter updates.',
    tags: ['Email', 'Infrastructure']
  }
];

export const MOCK_METRICS: Record<UserRole, Metric[]> = {
  [UserRole.LEAD]: [
    { label: 'Team Load', value: '82%', change: 5, trend: 'up' },
    { label: 'Critical Incidents', value: 2, change: -1, trend: 'down' },
    { label: 'Avg MTTR', value: '45m', change: -10, trend: 'down' },
    { label: 'SLA Breach Risk', value: 'Low', trend: 'neutral' },
  ],
  [UserRole.AGENT]: [
    { label: 'My Open Tickets', value: 4, change: 1, trend: 'up' },
    { label: 'Avg Response Time', value: '5m', change: -2, trend: 'down' },
    { label: 'Tasks Completed', value: 12, change: 15, trend: 'up' },
    { label: 'Shift Remaining', value: '3h', trend: 'neutral' },
  ],
  [UserRole.CLIENT]: [
    { label: 'Global Uptime', value: '99.99%', change: 0.01, trend: 'up' },
    { label: 'Avg API Latency', value: '42ms', change: -5, trend: 'down' },
    { label: 'Requests (24h)', value: '4.2M', change: 12, trend: 'up' },
    { label: 'Error Rate', value: '0.01%', change: 0, trend: 'neutral' },
  ]
};

export const MOCK_CHART_DATA: ChartData[] = [
  { name: 'Mon', value: 4, value2: 2 },
  { name: 'Tue', value: 3, value2: 5 },
  { name: 'Wed', value: 7, value2: 3 },
  { name: 'Thu', value: 2, value2: 6 },
  { name: 'Fri', value: 6, value2: 4 },
  { name: 'Sat', value: 1, value2: 1 },
  { name: 'Sun', value: 2, value2: 1 },
];

export const MOCK_TEAM: TeamMember[] = [
  { id: 't1', name: 'Mike Chen', role: 'L3 Engineer', status: 'ONLINE', skills: ['Database', 'AWS'], load: 85 },
  { id: 't2', name: 'Lisa Ray', role: 'L2 Support', status: 'BUSY', skills: ['Network', 'Security'], load: 92 },
  { id: 't3', name: 'James Bolt', role: 'L1 Agent', status: 'ONLINE', skills: ['Triage', 'Billing'], load: 40 },
  { id: 't4', name: 'Sarah Connor', role: 'Team Lead', status: 'ONLINE', skills: ['Management', 'Incident'], load: 60 },
];

export const MOCK_PLAYBOOKS: Playbook[] = [
  { id: 'pb1', title: 'Database Failover Procedure', category: 'Infrastructure', steps: ['Verify replica lag', 'Promote replica', 'Update connection strings', 'Restart app services'] },
  { id: 'pb2', title: 'DDoS Mitigation', category: 'Security', steps: ['Identify attack vector', 'Enable WAF under attack mode', 'Block IP ranges', 'Scale frontend'] },
  { id: 'pb3', title: 'High Memory Usage - App Container', category: 'Application', steps: ['Capture heap dump', 'Analyze with AI', 'Rolling restart', 'Scale horizontally'] },
];

// --- Client Dashboard Specifics ---
export const MOCK_CLIENT_SERVICES = [
  { name: 'Authentication API', status: 'Operational', uptime: '99.99%', latency: '24ms', region: 'Global' },
  { name: 'Payment Gateway', status: 'Operational', uptime: '100.00%', latency: '120ms', region: 'US-East' },
  { name: 'Search Service', status: 'Degraded', uptime: '99.50%', latency: '450ms', region: 'EU-West' },
  { name: 'Image CDN', status: 'Operational', uptime: '99.98%', latency: '15ms', region: 'Global' },
  { name: 'Notification Service', status: 'Operational', uptime: '99.95%', latency: '85ms', region: 'US-West' },
];

export const MOCK_CLIENT_REGIONS = [
  { name: 'North America', status: 'Healthy', latency: 45 },
  { name: 'Europe', status: 'Warning', latency: 180 },
  { name: 'Asia Pacific', status: 'Healthy', latency: 95 },
  { name: 'South America', status: 'Healthy', latency: 110 },
];
