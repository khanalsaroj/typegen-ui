import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Code2, Loader2, Sparkles } from 'lucide-react';
import { useCopyShortcut } from '@/hooks/useKeyboardShortcuts';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
import { TypeSelector } from '@/components/generator/TypeSelector';
import { TableSelector } from '@/components/generator/TableSelector';
import { ConfigSummary } from '@/components/generator/ConfigSummary';
import { AdditionalOptionsModal } from '@/components/generator/AdditionalOptionsModal';
import { generatorService } from '@/services/generator.service';
import { useToast } from '@/hooks/use-toast';
import { useGeneratorSettings } from '@/hooks/useGeneratorSettings';
import type { LanguageType, SupportedLanguage } from '@/types/generator.types';
import type { TableInfo, TypeRequest } from '@/types';
import { useDatabaseConnections } from '@/hooks/useDatabaseConnections.ts';

const languageOptions: { value: SupportedLanguage; label: string; extension: string }[] = [
  { value: 'typescript', label: 'TypeScript', extension: '.ts' },
  { value: 'java', label: 'Java', extension: '.java' },
  { value: 'csharp', label: 'C#', extension: '.cs' },
];

export function Generator() {
  const [selectedConnection, setSelectedConnection] = useState<number>(0);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguage>('typescript');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const { toast } = useToast();
  const { updateSelectedType, updateTypeConfig, getTypeConfig, getSelectedType } =
    useGeneratorSettings();

  const selectedType = getSelectedType(targetLanguage);
  const [payload, setPayload] = useState<TypeRequest>();
  const currentTypeConfig = getTypeConfig(targetLanguage, selectedType);

  const { data: connections, isLoading: connectionsLoading } = useDatabaseConnections();

  const [allTables, setAllTables] = useState<TableInfo[]>([]);

  const generateMutation = useMutation({
    mutationFn: () =>
      generatorService.generateType({
        connectionId: payload.connectionId,
        options: currentTypeConfig.advancedOptions ?? {},
        prefix: currentTypeConfig.prefix,
        suffix: currentTypeConfig.suffix,
        style: selectedType,
        language: targetLanguage,
        tableNames: selectedTables.length > 0 ? selectedTables : null,
      }),
    onSuccess: (response) => {
      setGeneratedCode(response);
      toast({
        title: 'Types generated successfully',
        description: `Generated ${targetLanguage.toUpperCase()} types for ${selectedTables.length} tables.`,
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

  const handleTableToggle = (tableName: string) => {
    setSelectedTables((prev) =>
      prev.includes(tableName) ? prev.filter((t) => t !== tableName) : [...prev, tableName],
    );
  };

  const handleSelectAll = () => {
    if (selectedTables.length === allTables.length) {
      setSelectedTables([]);
    } else {
      setSelectedTables(allTables.map((t) => t.name));
    }
  };

  const handleTypeChange = (type: LanguageType) => {
    updateSelectedType(targetLanguage, type);
  };

  const handleOptionsApply = (options: Record<string, boolean>, prefix: string, suffix: string) => {
    updateTypeConfig(targetLanguage, selectedType, {
      advancedOptions: options,
      prefix,
      suffix,
    });
  };

  const previewCode = useMemo(() => {
    return generatedCode;
  }, [generatedCode]);

  const handleDatabaseConnToggle = (connectionId: number) => {
    const connection = connections.find((conn) => conn.connectionId === connectionId);
    if (!connection) return;
    setAllTables(connection.tableInfo);
    setSelectedConnection(connectionId);
    setPayload((prevState) => ({
      ...prevState,
      connectionId: connectionId,
    }));
    setSelectedTables([]);
    setGeneratedCode('');
  };

  // Copy shortcut (Ctrl+Shift+C)
  const getPreviewCode = useCallback(() => previewCode, [previewCode]);
  useCopyShortcut(getPreviewCode);

  const selectedLanguage = languageOptions.find((l) => l.value === targetLanguage);

  return (
    <div className="space-y-4 animate-fade-in h-full">
      {/* Page Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Type Generator</h1>
          <p className="text-muted-foreground">Generate typed code from your database schemas</p>
        </div>
        <Button
          onClick={() => generateMutation.mutate()}
          disabled={
            !selectedConnection || selectedTables.length === 0 || generateMutation.isPending
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

      {/* Three Column Layout */}
      <div className="grid gap-4 lg:grid-cols-10 h-[calc(100vh-180px)] min-h-[500px]">
        {/* Column 1 - Configuration (30%) */}
        <div className="lg:col-span-3 space-y-4 overflow-auto scrollbar-thin">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-4">Configuration</h3>

            <div className="space-y-4">
              {/* Database Selection */}
              <div className="space-y-2">
                <Label>Database Connection</Label>
                <Select
                  disabled={connectionsLoading}
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
                          value={conn?.connectionId?.toString()}
                          disabled={!conn.isConnected}
                        >
                          <div className="flex items-center gap-2">
                            <DatabaseIcon type={'mysql'} size="sm" />
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

              {/* Target Language */}
              <div className="space-y-2">
                <Label>Target Language</Label>
                <Select
                  value={targetLanguage}
                  onValueChange={(v) => setTargetLanguage(v as SupportedLanguage)}
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

              {/* Type Selection */}
              <TypeSelector
                language={targetLanguage}
                selectedType={selectedType}
                onTypeChange={handleTypeChange}
              />

              {/* Additional Options Button */}
              <div className="pt-2">
                <AdditionalOptionsModal
                  language={targetLanguage}
                  selectedType={selectedType}
                  advancedOptions={currentTypeConfig.advancedOptions}
                  prefix={currentTypeConfig.prefix}
                  suffix={currentTypeConfig.suffix}
                  onApply={handleOptionsApply}
                />
              </div>
            </div>
          </div>

          {/* Config Summary */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold text-sm mb-3">Active Configuration</h3>
            <ConfigSummary
              language={targetLanguage}
              selectedType={selectedType}
              advancedOptions={currentTypeConfig.advancedOptions}
              prefix={currentTypeConfig.prefix}
              suffix={currentTypeConfig.suffix}
            />
          </div>
        </div>

        {/* Column 2 - Table List (30%) */}
        <div className="lg:col-span-3 h-full">
          <TableSelector
            tables={allTables}
            selectedTables={selectedTables}
            onTableToggle={handleTableToggle}
            onSelectAll={handleSelectAll}
            isLoading={false}
          />
        </div>

        {/* Column 3 - Preview (40%) */}
        <div className="lg:col-span-4 h-full">
          <div className="rounded-lg border border-border bg-card overflow-hidden h-full flex flex-col">
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex-shrink-0">
              <h3 className="font-semibold text-sm">Preview</h3>
            </div>

            <div className="flex-1 overflow-auto">
              {selectedTables.length > 0 && previewCode ? (
                <div className="p-4 h-full">
                  <CodePreview
                    code={previewCode}
                    language={targetLanguage === 'csharp' ? 'C#' : targetLanguage}
                    fileName={`types${selectedLanguage?.extension}`}
                    maxHeight="100%"
                  />
                </div>
              ) : (
                <EmptyState
                  icon={Code2}
                  title="No preview available"
                  description="Select tables to preview the generated types"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Generator;
