import { useState, useEffect, useMemo } from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { SupportedLanguage, LanguageType } from '@/types/generator.types';
import {
  getTypeSpecificOptionLabels,
  getTypeSpecificDefaultOptions,
} from '@/types/generator.types';

interface AdditionalOptionsModalProps {
  language: SupportedLanguage;
  selectedType: LanguageType;
  advancedOptions: Record<string, boolean>;
  prefix: string;
  suffix: string;
  onApply: (options: Record<string, boolean>, prefix: string, suffix: string) => void;
}

function getTypeDisplayName(language: SupportedLanguage, selectedType: LanguageType): string {
  const typeNames: Record<string, string> = {
    dto: 'DTO/Class',
    record: 'Record',
    pojo: 'POJO',
    interface: 'Interface',
    type: 'Type Alias',
    class: 'Class',
  };
  return typeNames[selectedType] || selectedType;
}

export function AdditionalOptionsModal({
  language,
  selectedType,
  advancedOptions,
  prefix,
  suffix,
  onApply,
}: AdditionalOptionsModalProps) {
  const [open, setOpen] = useState(false);
  const [localOptions, setLocalOptions] = useState<Record<string, boolean>>({});
  const [localPrefix, setLocalPrefix] = useState(prefix);
  const [localSuffix, setLocalSuffix] = useState(suffix);

  const optionLabels = useMemo(
    () => getTypeSpecificOptionLabels(language, selectedType),
    [language, selectedType],
  );

  const defaultOptions = useMemo(
    () => getTypeSpecificDefaultOptions(language, selectedType),
    [language, selectedType],
  );

  useEffect(() => {
    if (open) {
      const relevantOptions: Record<string, boolean> = {};
      const optionKeys = Object.keys(optionLabels);

      optionKeys.forEach((key) => {
        if (key in advancedOptions) {
          relevantOptions[key] = advancedOptions[key];
        } else if (key in defaultOptions) {
          relevantOptions[key] = defaultOptions[key];
        } else {
          relevantOptions[key] = false;
        }
      });

      setLocalOptions(relevantOptions);
      setLocalPrefix(prefix);
      setLocalSuffix(suffix);
    }
  }, [open, advancedOptions, prefix, suffix, optionLabels, defaultOptions]);

  const handleOptionChange = (key: string, value: boolean) => {
    setLocalOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApply(localOptions, localPrefix, localSuffix);
    setOpen(false);
  };

  const optionKeys = Object.keys(optionLabels);
  const typeDisplayName = getTypeDisplayName(language, selectedType);
  const languageDisplayName = language.charAt(0).toUpperCase() + language.slice(1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 size={16} />
          Additional Options
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {languageDisplayName} {typeDisplayName} Options
          </DialogTitle>
          <DialogDescription>
            Configure generation options specific to {languageDisplayName} {typeDisplayName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Advanced Options Grid */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{typeDisplayName} Generation Options</Label>
            <div className="grid grid-cols-2 gap-3">
              {optionKeys.map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-2 rounded-lg border border-border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={localOptions[key] ?? false}
                    onCheckedChange={(checked) => handleOptionChange(key, checked === true)}
                  />
                  <span className="text-sm">{optionLabels[key]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Prefix/Suffix Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prefix">Class Name Prefix</Label>
              <Input
                id="prefix"
                placeholder="e.g., I, Base"
                value={localPrefix}
                onChange={(e) => setLocalPrefix(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suffix">Class Name Suffix</Label>
              <Input
                id="suffix"
                placeholder="e.g., DTO, Entity"
                value={localSuffix}
                onChange={(e) => setLocalSuffix(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Options</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
