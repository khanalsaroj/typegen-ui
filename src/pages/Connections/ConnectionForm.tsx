import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { databaseService } from '@/services/database.service';
import { DatabaseConnection, DatabaseType } from '@/types';

const baseConnectionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().min(1).max(65535),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  databaseName: z.string().min(1, 'Database name is required'),
});

const postgresConnectionSchema = baseConnectionSchema.extend({
  dbType: z.literal('postgres'),
  schemaName: z.string().min(1, 'Schema is required for PostgresSQL'),
});

const otherConnectionSchema = baseConnectionSchema.extend({
  dbType: z.enum(['mysql', 'oracle', 'mssql']),
  schemaName: z.string().optional(),
});

const connectionSchema = z.discriminatedUnion('dbType', [
  postgresConnectionSchema,
  otherConnectionSchema,
]);
type ConnectionFormData = z.infer<typeof connectionSchema>;

interface ConnectionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const defaultPorts: Record<DatabaseType, number> = {
  mysql: 3306,
  postgres: 5432,
  oracle: 1521,
  mssql: 1433,
};

export function ConnectionForm({ onSuccess, onCancel }: ConnectionFormProps) {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ConnectionFormData>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      dbType: 'postgres',
      port: 5432,
    },
  });

  const selectedType = watch('dbType');

  const handleTypeChange = (value: DatabaseType) => {
    setValue('dbType', value);
    setValue('port', defaultPorts[value]);
  };

  const handleTestConnection = async () => {
    const formData = watch();

    if (!formData.host || !formData.username || !formData.password || !formData.databaseName) {
      setTestStatus('error');
      setTestMessage('Please fill in all required fields');
      return;
    }

    setTestStatus('testing');
    setTestMessage('');

    try {
      const result = await databaseService.testConnection(formData as DatabaseConnection);
      console.log('Connection test result:', result);
      setTestStatus(result.success ? 'success' : 'error');
      setTestMessage(result.message);
    } catch (error) {
      setTestStatus('error');
      setTestMessage(error instanceof Error ? error.message : 'Connection failed');
    }
  };

  const onSubmit = async (data: ConnectionFormData) => {
    setIsSubmitting(true);
    try {
      await databaseService.createConnection(data as DatabaseConnection);
      onSuccess();
    } catch (error) {
      console.error('Failed to create connection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Connection Name</Label>
        <Input
          id="name"
          placeholder="e.g., Production Database"
          {...register('name')}
          className="bg-muted/50"
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {/* Database Type */}
      <div className="space-y-2">
        <Label>Database Type</Label>
        <Select value={selectedType} onValueChange={handleTypeChange}>
          <SelectTrigger className="bg-muted/50">
            <SelectValue placeholder="Select database type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="postgres">PostgreSQL</SelectItem>
            <SelectItem value="mysql">MySQL / MariaDB</SelectItem>
            <SelectItem disabled={true} value="oracle">
              Oracle
            </SelectItem>
            <SelectItem disabled={true} value="mssql">
              Microsoft SQL Server
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Host & Port */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            placeholder="localhost or hostname"
            {...register('host')}
            className="bg-muted/50"
          />
          {errors.host && <p className="text-xs text-destructive">{errors.host.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            type="number"
            {...register('port', { valueAsNumber: true })}
            className="bg-muted/50"
          />
          {errors.port && <p className="text-xs text-destructive">{errors.port.message}</p>}
        </div>
      </div>

      {/* Username & Password */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Database user"
            {...register('username')}
            className="bg-muted/50"
          />
          {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            className="bg-muted/50"
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
      </div>

      {/* Database Name */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="database">Database Name</Label>
          <Input
            id="database"
            placeholder="e.g., my_database"
            {...register('databaseName')}
            className="bg-muted/50"
          />
          {errors.databaseName && (
            <p className="text-xs text-destructive">{errors.databaseName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="database">Schema</Label>
          <Input
            disabled={selectedType !== 'postgres'}
            id="schema"
            placeholder="e.g., my_database"
            {...register('schemaName')}
            className="bg-muted/50"
          />
          {errors.databaseName && (
            <p className="text-xs text-destructive">{errors.schemaName.message}</p>
          )}
        </div>
      </div>

      {/* Test Connection Status */}
      {testStatus !== 'idle' && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
            testStatus === 'success'
              ? 'bg-success/10 text-success'
              : testStatus === 'error'
                ? 'bg-destructive/10 text-destructive'
                : 'bg-muted text-muted-foreground'
          }`}
        >
          {testStatus === 'testing' && <Loader2 size={16} className="animate-spin" />}
          {testStatus === 'success' && <CheckCircle2 size={16} />}
          {testStatus === 'error' && <XCircle size={16} />}
          <span>{testStatus === 'testing' ? 'Testing connection...' : testMessage}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={handleTestConnection}
          disabled={testStatus === 'testing'}
        >
          {testStatus === 'testing' && <Loader2 size={16} className="animate-spin mr-2" />}
          Test Connection
        </Button>

        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 size={16} className="animate-spin mr-2" />}
            Save Connection
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ConnectionForm;
