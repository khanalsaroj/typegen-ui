import { cn } from '@/lib/utils';
import { CSHARP_TYPES, LanguageType, SupportedLanguage, TypeOption } from '@/types/generator.types';
import { JAVA_TYPES, TYPESCRIPT_TYPES } from '@/types/generator.types';

interface TypeSelectorProps {
  language: SupportedLanguage;
  selectedType: LanguageType;
  onTypeChange: (type: LanguageType) => void;
}

export function TypeSelector({ language, selectedType, onTypeChange }: TypeSelectorProps) {
  const getTypeOptions = (): TypeOption[] => {
    switch (language) {
      case 'java':
        return JAVA_TYPES;
      case 'typescript':
        return TYPESCRIPT_TYPES;
      case 'csharp':
        return CSHARP_TYPES;
    }
  };

  const typeOptions = getTypeOptions();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Type Selection</label>
      <div className="grid grid-cols-3 gap-2">
        {typeOptions.map((option: TypeOption) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onTypeChange(option.value)}
            className={cn(
              'rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-200',
              selectedType === option.value
                ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/20'
                : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
