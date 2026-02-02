import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Code2, FileCode, Loader2, Sparkles } from 'lucide-react';
import { useCopyShortcut } from '@/hooks/useKeyboardShortcuts';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/common/EmptyState';
import { CodePreview } from '@/components/common/CodePreview';
import { DatabaseIcon } from '@/components/common/DatabaseIcon';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import {
  MAPPER_OPERATIONS,
  MapperAdvancedOptions,
  MapperOperation,
  MapperSupportedLanguage,
} from '@/types/generator.types';
import type { MapperRequest, TableInfo } from '@/types';
import { useDatabaseConnections } from '@/hooks/useDatabaseConnections.ts';
import generatorService from '@/services/generator.service.ts';

const languageOptions: { value: MapperSupportedLanguage; label: string }[] = [
  { value: 'mybatis-xml', label: 'MyBatis (XML)' },
  { value: 'mybatis-annotation', label: 'MyBatis (Annotation)' },
];

export function Mapper() {
  const [selectedConnection, setSelectedConnection] = useState<number>(0);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [advancedOptions, setAdvancedOptions] = useState<MapperAdvancedOptions>();
  const [targetLanguage, setTargetLanguage] = useState<MapperSupportedLanguage>('mybatis-xml');
  const { toast } = useToast();
  const [payload, setPayload] = useState<MapperRequest>();
  const { data: connections, isLoading: connectionsLoading } = useDatabaseConnections();
  const [allTables, setAllTables] = useState<TableInfo[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>();

  const handleOperationToggle = (operation: MapperOperation) => {
    setAdvancedOptions((prev) => {
      if (operation === 'allCrud') {
        const newValue = !prev?.allCrud;
        return {
          allCrud: newValue,
          select: newValue,
          insert: newValue,
          update: newValue,
          delete: newValue,
        };
      }

      return {
        ...prev,
        [operation]: !prev?.[operation],
        allCrud: false,
      };
    });
  };

  function toPascalCase(str: string): string {
    return str
      .split(/[_-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  const isOperationSelected = (operation: MapperOperation): boolean => {
    return Boolean(advancedOptions?.[operation]);
  };

  // Generate mapper code
  const mapperCode = useMemo(() => {
    return generatedCode;
  }, [generatedCode]);

  const hasAnyOperationEnabled = (): boolean => {
    if (!advancedOptions) return false;
    return Boolean(
      advancedOptions.allCrud ||
      advancedOptions.select ||
      advancedOptions.insert ||
      advancedOptions.update ||
      advancedOptions.delete,
    );
  };

  const getMapperCode = useCallback(() => mapperCode, [mapperCode]);
  useCopyShortcut(getMapperCode);

  const handleDatabaseConnToggle = (connectionId: number) => {
    const connection = connections.find((conn) => conn.connectionId === connectionId);

    const tables = connection?.tableInfo ?? [];

    setSelectedConnection(connectionId);
    setAllTables(tables);

    setSelectedTable('');

    setPayload((prev) => ({
      ...prev,
      connectionId: Number(connectionId),
    }));
  };

  const generateMutation = useMutation({
    mutationFn: () =>
      generatorService.generateMapper({
        connectionId: payload.connectionId,
        options: advancedOptions,
        targetType: targetLanguage,
        tableName: selectedTable,
      }),
    onSuccess: (response) => {
      setGeneratedCode(response);
      toast({
        title: 'Mapper generated successfully',
        description: `Generated ${targetLanguage.toUpperCase()} types for ${selectedTable} tables.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  return (
    <div className="space-y-4 animate-fade-in h-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mapper Generator</h1>
          <p className="text-muted-foreground">
            Generate CRUD mapper code for your database tables
          </p>
        </div>
        <Button
          onClick={() => generateMutation.mutate()}
          disabled={
            !selectedConnection ||
            selectedTable === '' ||
            generateMutation.isPending ||
            !hasAnyOperationEnabled()
          }
          className="glow-primary"
        >
          {generateMutation.isPending ? (
            <Loader2 size={18} className="animate-spin mr-2" />
          ) : (
            <Sparkles size={18} className="mr-2" />
          )}
          Generate Types
        </Button>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3 h-[calc(100vh-180px)] min-h-[500px]">
        {/* Configuration Column */}
        <div className="space-y-4 overflow-auto scrollbar-thin">
          {/* Database & Table Selection */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-4">Configuration</h3>

            <div className="space-y-4">
              {/* Database Selection */}
              <div className="space-y-2">
                <Label>Database Connection</Label>
                <Select
                  value={selectedConnection === 0 ? '' : selectedConnection.toString()}
                  onValueChange={(value) => handleDatabaseConnToggle(parseInt(value))}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select database" />
                  </SelectTrigger>
                  <SelectContent>
                    {connectionsLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <LoadingSpinner size="sm" />
                      </div>
                    ) : connections && connections.length > 0 ? (
                      connections.map((conn) => (
                        <SelectItem
                          key={conn.connectionId}
                          value={conn?.connectionId.toString()}
                          disabled={!conn.isConnected}
                        >
                          <div className="flex items-center gap-2">
                            <DatabaseIcon type={conn.dbType} size="sm" />
                            <span>{conn.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-4 text-center text-sm text-muted-foreground">
                        No connections available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Table Selection */}
              <div className="space-y-2">
                <Label>Table</Label>
                <Select
                  value={selectedTable}
                  disabled={!selectedConnection}
                  onValueChange={(value) => setSelectedTable(value)}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {connectionsLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <LoadingSpinner size="sm" />
                      </div>
                    ) : allTables.length > 0 ? (
                      allTables.map((table) => (
                        <SelectItem key={table.name} value={table.name}>
                          {table.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-4 text-center text-sm text-muted-foreground">
                        No tables available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Target Language */}
              <div className="space-y-2">
                <Label>Target Language</Label>
                <Select
                  value={targetLanguage}
                  onValueChange={(v) => setTargetLanguage(v as MapperSupportedLanguage)}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Operations Selection */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-4">Operations</h3>
            <div className="space-y-2">
              {MAPPER_OPERATIONS.map((op) => (
                <label
                  key={op.value}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border border-border"
                >
                  <Checkbox
                    checked={isOperationSelected(op.value)}
                    onCheckedChange={() => handleOperationToggle(op.value)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{op.label}</p>
                    <p className="text-xs text-muted-foreground">{op.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-2 h-full">
          <div className="rounded-lg border border-border bg-card overflow-hidden h-full flex flex-col">
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileCode size={16} className="text-muted-foreground" />
                <h3 className="font-semibold text-sm">
                  {selectedTable ? `${toPascalCase(selectedTable)}Mapper` : 'Mapper Preview'}
                </h3>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {mapperCode ? (
                <div className="p-4 h-full">
                  <CodePreview
                    code={mapperCode}
                    language={targetLanguage === 'mybatis-xml' ? 'xml' : 'java'}
                    fileName={`${toPascalCase(selectedTable)}Mapper`}
                    maxHeight="100%"
                  />
                </div>
              ) : (
                <EmptyState
                  icon={Code2}
                  title="No preview available"
                  description="Select a table and operations to generate mapper code"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mapper;
