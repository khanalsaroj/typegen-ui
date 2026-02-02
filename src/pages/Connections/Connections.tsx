import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MoreVertical, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/common/EmptyState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DatabaseIcon } from '@/components/common/DatabaseIcon';
import { ConnectionForm } from './ConnectionForm';
import { databaseService } from '@/services/database.service';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner.tsx';
import { useDatabaseConnections } from '@/hooks/useDatabaseConnections.ts';

export function Connections() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: connections, isLoading } = useDatabaseConnections();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => databaseService.deleteConnection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] }).then((_) => {
        toast({
          title: 'Connection deleted',
          description: 'The database connection has been removed.',
        });
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete connection',
        variant: 'destructive',
      });
    },
  });

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['connections'] }).then((_) => {
      toast({
        title: 'Connection created',
        description: 'Your database connection has been saved.',
      });
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Database Connections</h1>
          <p className="text-muted-foreground">
            Manage your database connections for type generation
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add Connection
        </Button>
      </div>
      {/*Connections List*/}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg4" />
        </div>
      ) : connections && connections.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {connections.map((connection) => (
            <div
              key={connection.connectionId}
              className="group rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <DatabaseIcon type={connection.dbType} size="lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{connection.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {connection.host}:{connection.port}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => deleteMutation.mutate(connection.connectionId)}
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Database</span>
                  <span className="font-mono">{connection.databaseName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">User</span>
                  <span className="font-mono">{connection.username}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  {isLoading ? (
                    <StatusBadge status={'waiting'} label={'Checking...'} size="sm" />
                  ) : (
                    <StatusBadge
                      status={connection.isConnected ? 'success' : 'error'}
                      label={connection.isConnected ? 'Connected' : 'Disconnected'}
                      size="sm"
                    />
                  )}
                </div>
              </div>
              <p className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                Last Checked At : {new Date(connection.lastCheckedAt).toLocaleString('sv-SE')}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <EmptyState
            icon={Plus}
            title="No connections yet"
            description="Add your first database connection to start generating types"
            action={{
              label: 'Add Connection',
              onClick: () => setIsDialogOpen(true),
            }}
          />
        </div>
      )}

      {/* Add Connection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Database Connection</DialogTitle>
          </DialogHeader>
          <DialogDescription> </DialogDescription>
          <ConnectionForm onSuccess={handleFormSuccess} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Connections;
