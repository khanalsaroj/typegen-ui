import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { TableInfo } from '@/types';

interface TableSelectorProps {
  tables: TableInfo[];
  selectedTables: string[];
  onTableToggle: (tableName: string) => void;
  onSelectAll: () => void;
  isLoading?: boolean;
}

export function TableSelector({
  tables,
  selectedTables,
  onTableToggle,
  onSelectAll,
  isLoading,
}: TableSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredTables = useMemo(() => {
    if (!searchQuery.trim()) return tables;
    const query = searchQuery.toLowerCase();
    return tables.filter((t) => t.name.toLowerCase().includes(query));
  }, [tables, searchQuery]);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card h-full flex flex-col">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-sm">Tables</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">
            Tables ({selectedTables?.length}/{tables?.length})
          </h3>
          {tables?.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onSelectAll} className="h-7 text-xs">
              {selectedTables.length === tables.length ? 'Deselect All' : 'Select All'}
            </Button>
          )}
        </div>
        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-background/50"
          />
        </div>
      </div>

      {/* Table List */}
      <div className="flex-1 overflow-auto scrollbar-thin p-2">
        {filteredTables?.length > 0 ? (
          filteredTables?.map((table) => (
            <label
              key={table.name}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <Checkbox
                checked={selectedTables.includes(table.name)}
                onCheckedChange={() => onTableToggle(table.name)}
              />
              <span className="font-medium text-sm flex-1 truncate">{table.name}</span>
              <span className="text-xs text-muted-foreground">{table.columnCount} cols</span>
            </label>
          ))
        ) : searchQuery ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No tables match "{searchQuery}"
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No tables found in this database
          </div>
        )}
      </div>
    </div>
  );
}
