import { useQuery } from '@tanstack/react-query';
import { Activity, CheckCircle2, Clock, Database, Server, XCircle } from 'lucide-react';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DatabaseIcon } from '@/components/common/DatabaseIcon';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { healthService } from '@/services/health.service';
import { useDatabaseConnections } from '@/hooks/useDatabaseConnections.ts';

export function Dashboard() {
  const { data: connections, isLoading: connectionsLoading } = useDatabaseConnections();

  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ['health'],
    queryFn: () => healthService.getHealth(),
    refetchInterval: 120_000,
  });

  const isLoading = healthLoading || connectionsLoading;

  const connectedCount = connections?.filter((c) => c.isConnected).length || 0;
  const totalConnections = connections?.length || 0;

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your TypeGen instance and recent activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="System Status"
          value={health?.status === 'healthy' ? 'Healthy' : 'Degraded'}
          subtitle={health ? `Uptime: ${formatUptime(health.uptime)}` : undefined}
          icon={Activity}
          variant={health?.status === 'healthy' ? 'success' : 'warning'}
        />
        <StatCard
          title="Connections"
          value={`${connectedCount}/${totalConnections}`}
          subtitle="Active databases"
          icon={Database}
          variant="primary"
        />
        <StatCard
          title="API Latency"
          value={health?.database.connected ? `${health.database.latency}ms` : '--'}
          subtitle="Database response"
          icon={Clock}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Backend Health */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Backend Health</h2>
            <StatusBadge
              status={health?.status === 'healthy' ? 'success' : 'warning'}
              label={health?.status || 'Checking...'}
            />
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"></div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <Server size={18} className="text-muted-foreground" />
                  <span className="font-medium">API Server</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-success" />
                  <span className="text-sm text-muted-foreground">
                    v{health?.version || '1.0.0'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <Database size={18} className="text-muted-foreground" />
                  <span className="font-medium">Database</span>
                </div>
                <div className="flex items-center gap-2">
                  {health?.database.connected ? (
                    <CheckCircle2 size={16} className="text-success" />
                  ) : (
                    <XCircle size={16} className="text-destructive" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {health?.database.latency}ms
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-muted-foreground" />
                  <span className="font-medium">Uptime</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {health ? formatUptime(health.uptime) : '--'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Connected Databases */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Connected Databases</h2>
            <span className="text-sm text-muted-foreground">{totalConnections} total</span>
          </div>

          {connectionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : connections && connections?.length > 0 ? (
            <div className="space-y-3" key={Math.random()}>
              {connections.slice(0, 4).map((connection) => (
                <div
                  key={connection.connectionId}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <DatabaseIcon type={connection.dbType} />
                    <div>
                      <p className="font-medium text-sm">{connection.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {connection.host}:{connection.port}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={connection.isConnected ? 'success' : 'error'}
                      label={connection.isConnected ? 'Online' : 'Offline'}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Database size={32} className="text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No connections configured</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
