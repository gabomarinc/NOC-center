
import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Incident, TeamMember, Playbook } from '../types';
import { MOCK_INCIDENTS, MOCK_TEAM, MOCK_PLAYBOOKS } from '../constants';

export const useData = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'SUPABASE' | 'MOCK'>('MOCK');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Check if Supabase is actually configured with a valid key
      if (!isSupabaseConfigured()) {
        console.log('Supabase env vars missing. Falling back to MOCK data.');
        setIncidents(MOCK_INCIDENTS);
        setTeam(MOCK_TEAM);
        setPlaybooks(MOCK_PLAYBOOKS);
        setSource('MOCK');
        setLoading(false);
        return;
      }

      try {
        // --- Fetch Incidents ---
        const { data: incidentsData, error: incidentsError } = await supabase
          .from('incidents')
          .select('*')
          .order('created_at', { ascending: false });

        if (incidentsError) throw incidentsError;

        // Map DB columns (snake_case) to App types (camelCase)
        const mappedIncidents: Incident[] = (incidentsData || []).map((i: any) => ({
          id: i.id,
          title: i.title,
          status: i.status,
          severity: i.severity,
          createdAt: i.created_at, // Mapping created_at -> createdAt
          assignee: i.assignee,
          description: i.description,
          tags: i.tags || []
        }));

        // --- Fetch Team ---
        const { data: teamData, error: teamError } = await supabase
          .from('team_members')
          .select('*');

        if (teamError) throw teamError;

        // --- Fetch Playbooks ---
        const { data: playbooksData, error: playbooksError } = await supabase
          .from('playbooks')
          .select('*');

        if (playbooksError) throw playbooksError;

        setIncidents(mappedIncidents);
        setTeam((teamData || []) as TeamMember[]);
        setPlaybooks((playbooksData || []) as Playbook[]);
        setSource('SUPABASE');
        
      } catch (error) {
        console.error('Error fetching data from Supabase, falling back to mocks:', error);
        // Fallback to mocks if DB connection fails or is empty
        setIncidents(MOCK_INCIDENTS);
        setTeam(MOCK_TEAM);
        setPlaybooks(MOCK_PLAYBOOKS);
        setSource('MOCK');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { incidents, team, playbooks, loading, source };
};
