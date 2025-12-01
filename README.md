# NOC Command Center Demo

Una plataforma de operaciones NOC (Network Operations Center) moderna, minimalista y basada en roles (Lead, Agente, Cliente). Diseñada con Next.js (React), TypeScript, Tailwind CSS y Shadcn UI conceptual.

## 🚀 Características Principales

*   **Role-Based Access Control (RBAC)**: Vistas adaptativas para Lead (Admin), Agentes (Operativos) y Clientes (Ejecutivos).
*   **Live Data Sync**: Integración con **Supabase** para persistencia de datos en tiempo real.
*   **AI Operations**: Herramientas simuladas de análisis de logs, predicción de riesgos y un chatbot asistente embebido.
*   **Incident Management**: Flujo completo de creación, asignación y resolución de tickets.
*   **Team & Playbooks**: Gestión de carga de trabajo del equipo y ejecución de procedimientos estandarizados (SOPs).

## 🛠 Tech Stack

*   **Frontend**: React 18, TypeScript, Tailwind CSS.
*   **Charts**: Recharts.
*   **Icons**: Lucide React.
*   **Backend / DB**: Supabase (PostgreSQL).

## 🔐 Credenciales de Demo

El sistema permite "Quick Login" (Login Rápido), pero los usuarios configurados son:

| Rol | Email | Password |
|info|---|---|
| **Lead** | `sarah@noc-command.com` | `demo` |
| **Agent** | `john@noc-command.com` | `demo` |
| **Client** | `admin@acmecorp.com` | `demo` |

## 🗄 Configuración de Base de Datos (Supabase)

Para conectar este proyecto a tu propio proyecto de Supabase:

1.  Crea un proyecto en [Supabase](https://supabase.com).
2.  Ve al **SQL Editor** y ejecuta el siguiente script para crear las tablas y datos semilla:

```sql
-- 1. Extensiones
create extension if not exists "uuid-ossp";

-- 2. Limpieza (Opcional)
drop table if exists activity_logs;
drop table if exists incidents;
drop table if exists team_members;
drop table if exists playbooks;
drop table if exists users;

-- 3. Tabla Usuarios
create table users (
  id text primary key,
  name text not null,
  role text not null check (role in ('LEAD', 'AGENT', 'CLIENT')),
  email text unique,
  avatar text,
  last_login timestamp with time zone
);

-- 4. Tabla Incidentes
create table incidents (
  id text primary key,
  title text not null,
  status text not null check (status in ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CRITICAL')),
  severity text not null check (severity in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  assignee text,
  description text,
  tags text[]
);

-- 5. Tabla Miembros Equipo
create table team_members (
  id text primary key,
  name text not null,
  role text not null,
  status text not null check (status in ('ONLINE', 'BUSY', 'OFFLINE')),
  skills text[],
  load integer default 0
);

-- 6. Tabla Playbooks
create table playbooks (
  id text primary key,
  title text not null,
  category text not null,
  steps text[]
);

-- 7. Tabla Activity Logs
create table activity_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id text references users(id),
  action text not null,
  details text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Seed Data (Datos de Prueba)
insert into users (id, name, role, email, avatar) values
('u1', 'Sarah Connor (Lead)', 'LEAD', 'sarah@noc-command.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4'),
('u2', 'John Doe (Agent)', 'AGENT', 'john@noc-command.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=c0aede'),
('u3', 'Acme Corp (Client)', 'CLIENT', 'admin@acmecorp.com', 'https://api.dicebear.com/7.x/initials/svg?seed=AC&backgroundColor=ffdfbf');

insert into incidents (id, title, status, severity, created_at, assignee, description, tags) values
('INC-2024-001', 'Database Latency Spike - US East', 'CRITICAL', 'CRITICAL', now() - interval '2 hours', 'John Doe', 'High latency observed in primary RDS cluster.', ARRAY['Database', 'AWS', 'Latency']),
('INC-2024-002', 'Payment Gateway Timeout', 'IN_PROGRESS', 'HIGH', now() - interval '4 hours', 'Sarah Connor', 'Stripe API webhooks failing with 504 errors.', ARRAY['Billing', 'API']),
('INC-2024-003', 'Frontend Asset 404s', 'OPEN', 'MEDIUM', now() - interval '5 hours', null, 'CDN cache invalidation issue.', ARRAY['CDN', 'Frontend']);

insert into team_members (id, name, role, status, skills, load) values
('t1', 'Mike Chen', 'L3 Engineer', 'ONLINE', ARRAY['Database', 'AWS'], 85),
('t2', 'Lisa Ray', 'L2 Support', 'BUSY', ARRAY['Network', 'Security'], 92),
('t3', 'James Bolt', 'L1 Agent', 'ONLINE', ARRAY['Triage', 'Billing'], 40),
('t4', 'Sarah Connor', 'Team Lead', 'ONLINE', ARRAY['Management', 'Incident'], 60);

insert into playbooks (id, title, category, steps) values
('pb1', 'Database Failover Procedure', 'Infrastructure', ARRAY['Verify replica lag', 'Promote replica', 'Update connection strings', 'Restart app services']),
('pb2', 'DDoS Mitigation', 'Security', ARRAY['Identify attack vector', 'Enable WAF under attack mode', 'Block IP ranges', 'Scale frontend']);
```

3.  Configura las variables de entorno en tu archivo `.env` o en `lib/supabase.ts`.

## 📦 Integraciones Futuras

La arquitectura está preparada para conectarse con:
*   **Zapier / Make**: Mediante webhooks simulados en el componente `Settings`.
*   **Zoho CRM**: Estructura de datos compatible para sincronización de tickets.
*   **OpenAI / Gemini**: Configuración lista en el panel de administración.
