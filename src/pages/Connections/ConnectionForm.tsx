import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  port: z.coerce.number().int().min(1).max(65535),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  databaseName: z.string().min(1, 'Database name is required'),
});

const schemaRequired = z.object({
  schemaName: z.string().min(1, 'Schema is required'),
});

const postgresConnectionSchema = baseConnectionSchema
  .extend({ dbType: z.literal('postgres') })
  .merge(schemaRequired);

const mssqlConnectionSchema = baseConnectionSchema
  .extend({ dbType: z.literal('mssql') })
  .merge(schemaRequired);

const otherConnectionSchema = baseConnectionSchema.extend({
  dbType: z.enum(['mysql', 'oracle']),
  schemaName: z.string().optional(),
});

const connectionSchema = z.discriminatedUnion('dbType', [
  postgresConnectionSchema,
  mssqlConnectionSchema,
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

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export function ConnectionForm({ onSuccess, onCancel }: ConnectionFormProps) {
  const [testStatus, setTestStatus] = useState<AsyncStatus>('idle');
  const [testMessage, setTestMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<ConnectionFormData>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      dbType: 'postgres',
      port: 5432,
      schemaName: 'public',
    },
  });

  const selectedType = watch('dbType');

  const handleTestConnection = async () => {
    const isValid = await trigger();
    if (!isValid) {
      setTestStatus('error');
      setTestMessage('Fix validation errors before testing connection.');
      return;
    }

    setTestStatus('loading');
    setTestMessage('');

    try {
      const formData = getValues();
      const result = await databaseService.testConnection(formData as DatabaseConnection);

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
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Connection Name</Label>
        <Input id="name" {...register('name')} className="bg-muted/50" />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {/* Database Type */}
      <div className="space-y-2">
        <Label>Database Type</Label>
        <Controller
          name="dbType"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value: DatabaseType) => {
                field.onChange(value);
                setValue('port', defaultPorts[value], { shouldDirty: true });
                if (value === 'postgres') {
                  setValue('schemaName', 'public', { shouldDirty: true });
                }
              }}
            >
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder="Select database type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="postgres">PostgreSQL</SelectItem>
                <SelectItem value="mysql">MySQL / MariaDB</SelectItem>
                <SelectItem value="mssql">Microsoft SQL Server</SelectItem>
                <SelectItem disabled value="oracle">
                  Oracle
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Host & Port */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="host">Host</Label>
          <Input id="host" {...register('host')} className="bg-muted/50" />
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
          <Input id="username" {...register('username')} className="bg-muted/50" />
          {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} className="bg-muted/50" />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
      </div>

      {/* Database & Schema */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="databaseName">Database Name</Label>
          <Input id="databaseName" {...register('databaseName')} className="bg-muted/50" />
          {errors.databaseName && (
            <p className="text-xs text-destructive">{errors.databaseName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="schemaName">Schema</Label>
          <Input
            id="schemaName"
            disabled={selectedType === 'mysql'}
            {...register('schemaName')}
            className="bg-muted/50"
          />
          {errors.schemaName && (
            <p className="text-xs text-destructive">{errors.schemaName.message}</p>
          )}
        </div>
      </div>

      {/* Test Status */}
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
          {testStatus === 'loading' && <Loader2 size={16} className="animate-spin" />}
          {testStatus === 'success' && <CheckCircle2 size={16} />}
          {testStatus === 'error' && <XCircle size={16} />}
          <span>{testStatus === 'loading' ? 'Testing connection...' : testMessage}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={handleTestConnection}
          disabled={testStatus === 'loading'}
        >
          {testStatus === 'loading' && <Loader2 size={16} className="animate-spin mr-2" />}
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
