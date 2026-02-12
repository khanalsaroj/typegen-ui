import { Check } from 'lucide-react';
import type { LanguageType, SupportedLanguage } from '@/types/generator.types';
import { getTypeSpecificOptionLabels } from '@/types/generator.types';

interface ConfigSummaryProps {
  language: SupportedLanguage;
  selectedType: LanguageType;
  advancedOptions: Record<string, boolean>;
  prefix: string;
  suffix: string;
}

const getShortLabel = (key: string): string => {
  const labels: Record<string, string> = {
    // Common formatting
    addSpaceFormatting: 'Spacing',
    extraSpacing: 'Spacing',

    // Java / Lombok
    builder: 'Builder',
    builderPattern: 'Builder',
    getter: 'Getter',
    setter: 'Setter',
    noArgsConstructor: 'NoArgs',
    allArgsConstructor: 'AllArgs',
    data: '@Data',
    serializable: 'Serializable',
    swaggerAnnotations: 'Swagger',
    jacksonAnnotations: 'Jackson',
    nullish: 'Null + Optional',
    maxValue: 'Max value',
    trimStrings: 'Trim',

    // TypeScript – shared
    exportAllTypes: 'Export all',
    readonlyProperties: 'Readonly',
    optionalProperties: 'Optional',
    allOptional: 'Optional',
    strictNullChecks: 'Strict null',
    comments: 'Comments',
    jsDocComments: 'JSDoc',
    partialType: 'Partial',
    readonlyType: 'Readonly',

    // TypeScript – aliases / classes
    exportDefault: 'Export default',

    // C#
    camelCaseProperties: 'Camel Case',
    nullable: 'Nullable',
    jsonPropertyName: 'JsonProp',
    positional: 'Positional',
    withInit: 'Init-only',
  };
  return labels[key] || key;
};

export function ConfigSummary({
  language,
  selectedType,
  advancedOptions,
  prefix,
  suffix,
}: ConfigSummaryProps) {
  const validOptionLabels = getTypeSpecificOptionLabels(language, selectedType);
  const validOptionKeys = Object.keys(validOptionLabels);

  const enabledOptions = validOptionKeys
    .filter((key) => advancedOptions[key] === true)
    .map((key) => getShortLabel(key));

  const hasPrefix = prefix.trim().length > 0;
  const hasSuffix = suffix.trim().length > 0;

  if (enabledOptions.length === 0 && !hasPrefix && !hasSuffix) {
    return (
      <div className="text-xs text-muted-foreground italic">No additional options configured</div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Enabled Options */}
      {enabledOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {enabledOptions.slice(0, 12).map((option) => (
            <span
              key={option}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium"
            >
              <Check size={10} />
              {option}
            </span>
          ))}
          {enabledOptions.length > 12 && (
            <span className="text-xs text-muted-foreground">
              +{enabledOptions.length - 12} more
            </span>
          )}
        </div>
      )}

      {/* Prefix/Suffix */}
      {(hasPrefix || hasSuffix) && (
        <div className="flex gap-3 text-xs text-muted-foreground">
          {hasPrefix && (
            <span>
              Prefix: <code className="text-foreground">{prefix}</code>
            </span>
          )}
          {hasSuffix && (
            <span>
              Suffix: <code className="text-foreground">{suffix}</code>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
