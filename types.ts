export enum UserRole {
  LEAD = 'LEAD',
  AGENT = 'AGENT',
  CLIENT = 'CLIENT'
}

export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CRITICAL';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email?: string;
}

export interface Incident {
  id: string;
  title: string;
  status: IncidentStatus;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  assignee?: string;
  description: string;
  tags: string[];
}

export interface Metric {
  label: string;
  value: string | number;
  change?: number; // percentage
  trend: 'up' | 'down' | 'neutral';
}

export interface ChartData {
  name: string;
  value: number;
  value2?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'ONLINE' | 'BUSY' | 'OFFLINE';
  skills: string[];
  load: number; // 0-100%
}

export interface Playbook {
  id: string;
  title: string;
  category: string;
  steps: string[];
}

// --- New Types for Settings ---

export interface IntegrationConfig {
  id: string;
  name: string;
  provider: 'slack' | 'zapier' | 'make';
  status: 'connected' | 'disconnected';
  apiKey?: string;
  webhookUrl?: string;
  lastSync?: string;
}

export interface AIConfig {
  provider: 'openai' | 'gemini' | 'anthropic';
  apiKey: string;
  model: string;
  temperature: number;
}