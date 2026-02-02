export type SupportedLanguage = 'typescript' | 'java' | 'csharp';
export type MapperSupportedLanguage = 'mybatis-xml' | 'mybatis-annotation';

export type JavaType = 'dto' | 'record' | 'pojo';
export type TypeScriptType = 'class' | 'interface' | 'type' | 'zod';
export type CSharpType = 'class' | 'record' | 'dto';

export type LanguageType = JavaType | TypeScriptType | CSharpType;
export type TypeOption = {
  value: LanguageType;
  label: string;
};

export const JAVA_TYPES: { value: JavaType; label: string }[] = [
  { value: 'dto', label: 'Java DTO' },
  { value: 'record', label: 'Java Record' },
];

export const TYPESCRIPT_TYPES: { value: TypeScriptType; label: string }[] = [
  { value: 'interface', label: 'Interface' },
  { value: 'class', label: 'Class' },
  { value: 'type', label: 'Type Alias' },
  { value: 'zod', label: 'Zod Schema' },
];

export const CSHARP_TYPES: { value: CSharpType; label: string }[] = [
  { value: 'class', label: 'C# Class' },
  { value: 'record', label: 'C# Record' },
  { value: 'dto', label: 'C# DTO' },
];

export interface JavaRecordAdvancedOptions {
  builder: boolean;
  extraSpacing: boolean;
  swaggerAnnotations: boolean;
  jacksonAnnotations: boolean;
}

export interface JavaClassAdvancedOptions {
  getter: boolean;
  setter: boolean;
  noArgsConstructor: boolean;
  allArgsConstructor: boolean;
  builder: boolean;
  data: boolean;
  swaggerAnnotations: boolean;
  serializable: boolean;
  jacksonAnnotations: boolean;
  extraSpacing: boolean;
}

export interface TypeScriptInterfaceAdvancedOptions {
  exportAllTypes: boolean;
  readonlyProperties: boolean;
  optionalProperties: boolean;
  strictNullChecks: boolean;
  comments: boolean;
  jsDocComments: boolean;
  partialType: boolean;
  readonlyType: boolean;
  extraSpacing: boolean;
}

export interface TypeScriptTypeAdvancedOptions {
  exportAllTypes: boolean;
  readonlyProperties: boolean;
  optionalProperties: boolean;
  strictNullChecks: boolean;
  comments: boolean;
  jsDocComments: boolean;
  partialType: boolean;
  readonlyType: boolean;
  extraSpacing: boolean;
}

export interface TypeScriptClassAdvancedOptions {
  exportAllTypes: boolean;
  readonlyProperties: boolean;
  optionalProperties: boolean;
  strictNullChecks: boolean;
  comments: boolean;
  jsDocComments: boolean;
  partialType: boolean;
  readonlyType: boolean;
  extraSpacing: boolean;
}

export interface TypeScriptZodAdvancedOptions {
  exportAllTypes: boolean;
  allOptional: boolean;
  comments: boolean;
  nullable: boolean;
  nullish: boolean;
  maxValue: boolean;
  trimStrings: boolean;
}

export interface CSharpRecordAdvancedOptions {
  extraSpacing: boolean;
  nullable: boolean;
  jsonPropertyName: boolean;
  primaryConstructor: boolean;
  withExpression: boolean;
  positionalSyntax: boolean;
}

export interface CSharpClassAdvancedOptions {
  extraSpacing: boolean;
  nullable: boolean;
  jsonPropertyName: boolean;
  dataAnnotations: boolean;
  initOnlySetters: boolean;
  propertyChangedNotify: boolean;
}

export interface MapperAdvancedOptions {
  allCrud?: boolean;
  select?: boolean;
  insert?: boolean;
  update?: boolean;
  delete?: boolean;
}

export type TypeSpecificAdvancedOptions =
  | JavaRecordAdvancedOptions
  | JavaClassAdvancedOptions
  | TypeScriptInterfaceAdvancedOptions
  | TypeScriptTypeAdvancedOptions
  | TypeScriptClassAdvancedOptions
  | TypeScriptZodAdvancedOptions
  | CSharpRecordAdvancedOptions
  | CSharpClassAdvancedOptions;

export const JAVA_RECORD_OPTION_LABELS: Record<keyof JavaRecordAdvancedOptions, string> = {
  builder: 'Builder pattern',
  extraSpacing: 'Add space formatting',
  swaggerAnnotations: 'Add Swagger Annotations',
  jacksonAnnotations: 'Add Jackson Annotations',
};

export const JAVA_CLASS_OPTION_LABELS: Record<keyof JavaClassAdvancedOptions, string> = {
  getter: 'Add @Getter',
  setter: 'Add @Setter',
  noArgsConstructor: 'Add @NoArgsConstructor',
  allArgsConstructor: 'Add @AllArgsConstructor',
  builder: 'Add @Builder',
  data: 'Add @Data',
  swaggerAnnotations: 'Add Swagger Annotations',
  serializable: 'Implement Serializable',
  jacksonAnnotations: 'Add Jackson Annotations',
  extraSpacing: 'Extra Spacing',
};

export const TYPESCRIPT_INTERFACE_OPTION_LABELS: Record<
  keyof TypeScriptInterfaceAdvancedOptions,
  string
> = {
  exportAllTypes: 'Export All Types',
  readonlyProperties: 'Use readonly Properties',
  optionalProperties: 'Use Optional Properties',
  strictNullChecks: 'Enable strictNullChecks',
  comments: 'Add Comments',
  jsDocComments: 'Add JSDoc Comments',
  partialType: 'Generate Partial',
  readonlyType: 'Generate Readonly',
  extraSpacing: 'Extra Spacing',
};

export const TYPESCRIPT_TYPE_OPTION_LABELS: Record<keyof TypeScriptTypeAdvancedOptions, string> = {
  exportAllTypes: 'Export All Types',
  readonlyProperties: 'Use readonly Properties',
  optionalProperties: 'Use Optional Properties',
  strictNullChecks: 'Enable strictNullChecks',
  comments: 'Add Comments',
  jsDocComments: 'Add JSDoc Comments',
  partialType: 'Generate Partial',
  readonlyType: 'Generate Readonly',
  extraSpacing: 'Extra Spacing',
};

export const TYPESCRIPT_CLASS_OPTION_LABELS: Record<keyof TypeScriptClassAdvancedOptions, string> =
  {
    exportAllTypes: 'Export All Types',
    readonlyProperties: 'Use readonly Properties',
    optionalProperties: 'Use Optional Properties',
    strictNullChecks: 'Enable strictNullChecks',
    comments: 'Add Comments',
    jsDocComments: 'Add JSDoc Comments',
    partialType: 'Generate Partial',
    readonlyType: 'Generate Readonly',
    extraSpacing: 'Extra Spacing',
  };

export const TYPESCRIPT_ZOD_OPTION_LABELS: Record<keyof TypeScriptZodAdvancedOptions, string> = {
  exportAllTypes: 'Export All Types',
  allOptional: 'Use Optional Properties',
  comments: 'Add Comments',
  nullable: 'Make all Nullable',
  nullish: 'Make all Nullable and Optional',
  maxValue: 'Use Max',
  trimStrings: 'Apply trim() to Strings',
};

export const CSHARP_RECORD_OPTION_LABELS: Record<keyof CSharpRecordAdvancedOptions, string> = {
  extraSpacing: 'Add space formatting',
  nullable: 'Nullable reference types',
  jsonPropertyName: 'JsonPropertyName attributes',
  primaryConstructor: 'Primary constructor',
  withExpression: 'With expression support',
  positionalSyntax: 'Positional record syntax',
};

export const CSHARP_CLASS_OPTION_LABELS: Record<keyof CSharpClassAdvancedOptions, string> = {
  extraSpacing: 'Add space formatting',
  nullable: 'Nullable reference types',
  jsonPropertyName: 'JsonPropertyName attributes',
  dataAnnotations: 'Data annotations',
  initOnlySetters: 'Init-only setters',
  propertyChangedNotify: 'INotifyPropertyChanged',
};

export function getTypeSpecificOptionLabels(
  language: SupportedLanguage,
  selectedType: LanguageType,
): Record<string, string> {
  if (language === 'java') {
    if (selectedType === 'record') {
      return JAVA_RECORD_OPTION_LABELS;
    }
    return JAVA_CLASS_OPTION_LABELS;
  }

  if (language === 'typescript') {
    if (selectedType === 'interface') {
      return TYPESCRIPT_INTERFACE_OPTION_LABELS;
    }
    if (selectedType === 'type') {
      return TYPESCRIPT_TYPE_OPTION_LABELS;
    }
    if (selectedType === 'zod') {
      return TYPESCRIPT_ZOD_OPTION_LABELS;
    }
    return TYPESCRIPT_CLASS_OPTION_LABELS;
  }

  if (language === 'csharp') {
    if (selectedType === 'record') {
      return CSHARP_RECORD_OPTION_LABELS;
    }
    return CSHARP_CLASS_OPTION_LABELS;
  }

  return {};
}

export function getTypeSpecificDefaultOptions(
  language: SupportedLanguage,
  selectedType: LanguageType,
): Record<string, boolean> {
  if (language === 'java') {
    if (selectedType === 'record') {
      return {
        builder: false,
        extraSpacing: false,
        swaggerAnnotations: true,
        jacksonAnnotations: false,
      } satisfies JavaRecordAdvancedOptions;
    }
    return {
      getter: false,
      setter: false,
      noArgsConstructor: false,
      allArgsConstructor: false,
      builder: true,
      data: true,
      swaggerAnnotations: true,
      serializable: false,
      jacksonAnnotations: false,
      extraSpacing: false,
    } satisfies JavaClassAdvancedOptions;
  }

  if (language === 'typescript') {
    if (selectedType === 'zod') {
      return {
        exportAllTypes: false,
        comments: false,
        allOptional: true,
        nullable: false,
        nullish: false,
        maxValue: false,
        trimStrings: true,
      } satisfies TypeScriptZodAdvancedOptions;
    }
    if (selectedType === 'type') {
      return {
        exportAllTypes: false,
        readonlyProperties: true,
        optionalProperties: false,
        strictNullChecks: true,
        comments: false,
        jsDocComments: false,
        partialType: false,
        readonlyType: false,
        extraSpacing: false,
      } satisfies TypeScriptTypeAdvancedOptions;
    }
    return {
      exportAllTypes: false,
      readonlyProperties: true,
      optionalProperties: false,
      strictNullChecks: true,
      comments: false,
      jsDocComments: false,
      partialType: false,
      readonlyType: false,
      extraSpacing: false,
    } satisfies TypeScriptInterfaceAdvancedOptions;
  }

  if (language === 'csharp') {
    if (selectedType === 'record') {
      return {
        addSpaceFormatting: false,
        nullable: true,
        jsonPropertyName: false,
        primaryConstructor: true,
        withExpression: false,
        positionalSyntax: false,
      };
    }
    return {
      addSpaceFormatting: false,
      nullable: true,
      jsonPropertyName: false,
      dataAnnotations: false,
      initOnlySetters: false,
      propertyChangedNotify: false,
    };
  }

  return {};
}

export interface TypeConfig {
  advancedOptions: Record<string, boolean>;
  prefix: string;
  suffix: string;
}

export interface LanguageTypeSettings {
  selectedType: LanguageType;
  typeConfigs: Record<string, TypeConfig>; // key is the type (e.g., 'dto', 'record', 'interface')
}

export interface GeneratorSettings {
  java: LanguageTypeSettings & { selectedType: JavaType };
  typescript: LanguageTypeSettings & { selectedType: TypeScriptType };
  csharp: LanguageTypeSettings & { selectedType: CSharpType };
}

export function getTypeConfigKey(language: SupportedLanguage, type: LanguageType): string {
  return `${language}-${type}`;
}

export function getDefaultTypeConfig(language: SupportedLanguage, type: LanguageType): TypeConfig {
  return {
    advancedOptions: getTypeSpecificDefaultOptions(language, type),
    prefix: '',
    suffix: '',
  };
}

export const DEFAULT_GENERATOR_SETTINGS: GeneratorSettings = {
  java: {
    selectedType: 'dto',
    typeConfigs: {
      dto: getDefaultTypeConfig('java', 'dto'),
      record: getDefaultTypeConfig('java', 'record'),
    },
  },
  typescript: {
    selectedType: 'interface',
    typeConfigs: {
      interface: getDefaultTypeConfig('typescript', 'interface'),
      class: getDefaultTypeConfig('typescript', 'class'),
      type: getDefaultTypeConfig('typescript', 'type'),
      zod: getDefaultTypeConfig('typescript', 'zod'),
    },
  },
  csharp: {
    selectedType: 'class',
    typeConfigs: {
      class: getDefaultTypeConfig('csharp', 'class'),
      record: getDefaultTypeConfig('csharp', 'record'),
      dto: getDefaultTypeConfig('csharp', 'dto'),
    },
  },
};

export type MapperOperation = 'allCrud' | 'select' | 'insert' | 'update' | 'delete';

export const MAPPER_OPERATIONS: { value: MapperOperation; label: string; description: string }[] = [
  { value: 'allCrud', label: 'ALL CRUD', description: 'Generate all CRUD operations' },
  { value: 'select', label: 'SELECT', description: 'Read/query operations' },
  { value: 'insert', label: 'INSERT', description: 'Create operations' },
  { value: 'update', label: 'UPDATE', description: 'Update operations' },
  { value: 'delete', label: 'DELETE', description: 'Delete operations' },
];
