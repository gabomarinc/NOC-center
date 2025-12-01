
import React from 'react';
import { UserRole } from '../types';
import { useData } from '../hooks/useData';
import { Card, Badge, Button } from '../components/ui';
import { Search, Filter, PlayCircle, Zap, Database, Loader2 } from 'lucide-react';

interface IncidentsProps {
  role: UserRole;
}

const Incidents: React.FC<IncidentsProps> = ({ role }) => {
  const { incidents, loading, source } = useData();

  // Filter incidents for client to only show relevant ones
  const displayIncidents = role === UserRole.CLIENT 
    ? incidents.filter(i => i.severity !== 'LOW') 
    : incidents;

  const handleTrigger = (id: string, action: string) => {
    alert(`[Simulation] ${action} triggered for Incident ${id}.\n\nThis would send a webhook to Zapier/Make to update Zoho CRM.`);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Incident Desk
            {source === 'SUPABASE' && <Badge variant="outline" className="text-[10px] font-normal gap-1"><Database className="h-3 w-3" /> Live DB</Badge>}
          </h1>
          <p className="text-sm text-slate-500">Manage and track operational signals</p>
        </div>
        {role !== UserRole.CLIENT && (
          <Button variant="primary" onClick={() => handleTrigger('NEW', 'Create Incident')}>
            + New Incident
          </Button>
        )}
      </div>

      <Card>
        <div className="border-b border-slate-100 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-t-xl">
           <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                placeholder="Filter tickets..." 
                className="pl-9 h-9 w-full rounded-md border border-slate-300 text-sm focus:ring-1 focus:ring-indigo-500"
              />
           </div>
           <div className="flex gap-2">
             <Button variant="outline" size="sm"><Filter className="h-3 w-3 mr-2" /> Filter</Button>
             <Button variant="outline" size="sm">Export</Button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4 w-1/3">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assignee</th>
                {role !== UserRole.CLIENT && <th className="px-6 py-4">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {displayIncidents.length > 0 ? (
                displayIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">{incident.id}</td>
                    <td className="px-6 py-4">
                      <Badge variant={incident.severity === 'CRITICAL' ? 'destructive' : incident.severity === 'HIGH' ? 'warning' : 'default'}>
                        {incident.severity}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{incident.title}</div>
                      <div className="text-xs text-slate-500 truncate mt-1 max-w-xs">{incident.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={incident.status === 'RESOLVED' ? 'success' : 'outline'}>
                        {incident.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                       {incident.assignee ? (
                          <div className="flex items-center gap-2">
                             <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                               {incident.assignee.charAt(0)}
                             </div>
                             <span className="text-slate-700">{incident.assignee}</span>
                          </div>
                       ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                       )}
                    </td>
                    {role !== UserRole.CLIENT && (
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                            <button title="Run Playbook" onClick={() => handleTrigger(incident.id, 'Playbook')} className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded">
                              <PlayCircle className="h-4 w-4" />
                            </button>
                             <button title="Escalate to Zoho" onClick={() => handleTrigger(incident.id, 'Escalation')} className="p-1.5 hover:bg-amber-50 text-amber-600 rounded">
                              <Zap className="h-4 w-4" />
                            </button>
                         </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No incidents found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Incidents;
