export type SupportedLanguage = 'typescript' | 'java' | 'csharp' | 'go' | 'python';
export type MapperSupportedLanguage = 'mybatis-xml' | 'mybatis-annotation';

export type JavaType = 'dto' | 'record' | 'pojo';
export type TypeScriptType = 'class' | 'interface' | 'type' | 'zod';
export type CSharpType = 'record' | 'dto';
export type GOTypes = 'struct' | 'dto';
export type PythonTypes = 'dataclass' | 'pydantic' | 'class' | 'typed_dict';

export type LanguageType = JavaType | TypeScriptType | CSharpType | GOTypes | PythonTypes;
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
  { value: 'record', label: 'C# Record' },
  { value: 'dto', label: 'C# DTO' },
];

export const GO_TYPES: { value: GOTypes; label: string }[] = [{ value: 'struct', label: 'Struct' }];

export const PYTHON_TYPES: { value: PythonTypes; label: string }[] = [
  { value: 'dataclass', label: 'Data class' },
  { value: 'pydantic', label: 'Pydantic' },
  { value: 'class', label: 'Class' },
  { value: 'typed_dict', label: 'Typed Dict' },
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
  camelCaseProperties: boolean;
  nullable: boolean;
  jsonPropertyName: boolean;
  Positional: boolean;
  WithInit: boolean;
}

export interface CSharpDtoAdvancedOptions {
  extraSpacing: boolean;
  nullable: boolean;
  getter: boolean;
  setter: boolean;
  camelCaseProperties: boolean;
  jsonPropertyName: boolean;
}

export interface MapperAdvancedOptions {
  allCrud?: boolean;
  select?: boolean;
  insert?: boolean;
  update?: boolean;
  delete?: boolean;
}

export interface GoStructAdvancedOptions {
  jsonTags: boolean; // add `json:"field"`
  omitempty: boolean; // `json:"field,omitempty"`
  pointerFields: boolean; // use *type for optional fields
  exportFields: boolean; // capitalize fields (public)
  comments: boolean; // add field comments
  validateTags: boolean; // `validate:"required"`
  dbTags: boolean; // `db:"column_name"`
  mapstructureTags: boolean; // for config decoding
  extraSpacing: boolean;
}

export interface PythonCommonOptions {
  optionalFields: boolean;
  comments: boolean;
  docstrings: boolean;
  extraSpacing: boolean;
}

export interface PythonDataclassOptions extends PythonCommonOptions {
  defaultValues: boolean;
  frozen: boolean;
  slots: boolean;
  kwOnly: boolean; // Python 3.10+
  order: boolean; // generate comparison methods
  repr: boolean; // include __repr__
  eq: boolean; // equality methods
  unsafeHash: boolean;
}

export interface PythonPydanticOptions extends PythonCommonOptions {
  defaultValues: boolean;
  ormMode: boolean;
  validation: boolean;
  aliasGenerator: boolean;
  allowPopulationByFieldName: boolean;
  useEnumValues: boolean;
  strictTypes: boolean;
  arbitraryTypesAllowed: boolean;
}

export interface PythonClassOptions extends PythonCommonOptions {
  defaultValues: boolean;
  initMethod: boolean; // generate __init__
  reprMethod: boolean; // generate __repr__
  eqMethod: boolean; // generate __eq__
}

export interface PythonTypedDictOptions extends PythonCommonOptions {
  total: boolean; // required vs optional fields
}

export type TypeSpecificAdvancedOptions =
  | JavaRecordAdvancedOptions
  | JavaClassAdvancedOptions
  | TypeScriptInterfaceAdvancedOptions
  | TypeScriptTypeAdvancedOptions
  | TypeScriptClassAdvancedOptions
  | TypeScriptZodAdvancedOptions
  | CSharpRecordAdvancedOptions
  | CSharpDtoAdvancedOptions;

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
  camelCaseProperties: 'Use camel case',
  extraSpacing: 'Add space formatting',
  nullable: 'Enable nullable refs/value types',
  jsonPropertyName: 'JsonPropertyName',
  Positional: 'Positional',
  WithInit: 'init',
};

export const CSHARP_CLASS_OPTION_LABELS: Record<keyof CSharpDtoAdvancedOptions, string> = {
  extraSpacing: 'Add space formatting',
  nullable: 'Nullable reference types',
  getter: 'Add Getter',
  setter: 'Add Setter',
  camelCaseProperties: 'Use camel case',
  jsonPropertyName: 'JsonPropertyName attributes',
};

export const GO_STRUCT_OPTION_LABELS: Record<keyof GoStructAdvancedOptions, string> = {
  jsonTags: 'JSON Tags',
  omitempty: 'Omit Empty Fields',
  pointerFields: 'Use Pointer Fields',
  exportFields: 'Export Fields (Public)',
  comments: 'Add Comments',
  validateTags: 'Validation Tags',
  dbTags: 'Database Tags',
  mapstructureTags: 'Mapstructure Tags',
  extraSpacing: 'Extra Spacing',
};

export const PYTHON_DATACLASS_OPTION_LABELS: Record<keyof PythonDataclassOptions, string> = {
  optionalFields: 'Optional Fields',
  comments: 'Add Comments',
  docstrings: 'Add Docstrings',
  extraSpacing: 'Extra Spacing',
  defaultValues: 'Default Values',
  frozen: 'Immutable (Frozen)',
  slots: 'Use Slots',
  kwOnly: 'Keyword-only Fields',
  order: 'Enable Ordering',
  repr: 'Generate __repr__',
  eq: 'Enable Equality (__eq__)',
  unsafeHash: 'Unsafe Hash',
};

export const PYTHON_PYDANTIC_OPTION_LABELS: Record<keyof PythonPydanticOptions, string> = {
  optionalFields: 'Optional Fields',
  comments: 'Add Comments',
  docstrings: 'Add Docstrings',
  extraSpacing: 'Extra Spacing',
  defaultValues: 'Default Values',
  ormMode: 'ORM Mode',
  validation: 'Enable Validation',
  aliasGenerator: 'Alias Generator (camelCase ↔ snake_case)',
  allowPopulationByFieldName: 'Allow Population by Field Name',
  useEnumValues: 'Use Enum Values',
  strictTypes: 'Strict Types',
  arbitraryTypesAllowed: 'Allow Arbitrary Types',
};

export const PYTHON_CLASS_OPTION_LABELS: Record<keyof PythonClassOptions, string> = {
  optionalFields: 'Optional Fields',
  comments: 'Add Comments',
  docstrings: 'Add Docstrings',
  extraSpacing: 'Extra Spacing',
  defaultValues: 'Default Values',
  initMethod: 'Generate __init__',
  reprMethod: 'Generate __repr__',
  eqMethod: 'Generate __eq__',
};

export const PYTHON_TYPED_DICT_OPTION_LABELS: Record<keyof PythonTypedDictOptions, string> = {
  optionalFields: 'Optional Fields',
  comments: 'Add Comments',
  docstrings: 'Add Docstrings',
  extraSpacing: 'Extra Spacing',
  total: 'All Fields Required (total=True)',
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

  if (language === 'go') {
    return GO_STRUCT_OPTION_LABELS;
  }
  if (language === 'python') {
    if (selectedType === 'dataclass') {
      return PYTHON_DATACLASS_OPTION_LABELS;
    }
    if (selectedType === 'pydantic') {
      return PYTHON_PYDANTIC_OPTION_LABELS;
    }
    if (selectedType === 'class') {
      return PYTHON_CLASS_OPTION_LABELS;
    }
    if (selectedType === 'typed_dict') {
      return PYTHON_TYPED_DICT_OPTION_LABELS;
    }
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
        extraSpacing: false,
        camelCaseProperties: false,
        nullable: true,
        jsonPropertyName: false,
        Positional: false,
        WithInit: false,
      } satisfies CSharpRecordAdvancedOptions;
    }
    return {
      extraSpacing: false,
      nullable: true,
      jsonPropertyName: false,
      getter: false,
      setter: false,
      camelCaseProperties: false,
    } satisfies CSharpDtoAdvancedOptions;
  }

  if (language === 'go') {
    if (selectedType === 'struct') {
      return {
        jsonTags: false,
        omitempty: true,
        pointerFields: true,
        exportFields: true,
        comments: false,
        validateTags: true,
        dbTags: true,
        mapstructureTags: true,
        extraSpacing: false,
      } satisfies GoStructAdvancedOptions;
    }
    return {
      jsonTags: false,
      omitempty: false,
      pointerFields: true,
      exportFields: true,
      comments: true,
      validateTags: true,
      dbTags: true,
      mapstructureTags: true,
      extraSpacing: false,
    } satisfies GoStructAdvancedOptions;
  }

  if (language === 'python') {
    if (selectedType === 'dataclass') {
      return {
        optionalFields: false,
        defaultValues: false,
        frozen: false,
        slots: true,
        kwOnly: false,
        order: false,
        repr: true,
        eq: true,
        unsafeHash: false,
        comments: false,
        docstrings: false,
        extraSpacing: false,
      } satisfies PythonDataclassOptions;
    }

    if (selectedType === 'pydantic') {
      return {
        optionalFields: true,
        defaultValues: false,
        ormMode: true,
        validation: true,
        aliasGenerator: false,
        allowPopulationByFieldName: true,
        useEnumValues: true,
        strictTypes: false,
        arbitraryTypesAllowed: false,
        comments: false,
        docstrings: false,
        extraSpacing: false,
      } satisfies PythonPydanticOptions;
    }

    if (selectedType === 'class') {
      return {
        optionalFields: true,
        defaultValues: true,
        initMethod: false,
        reprMethod: true,
        eqMethod: false,
        comments: false,
        docstrings: false,
        extraSpacing: false,
      } satisfies PythonClassOptions;
    }

    if (selectedType === 'typed_dict') {
      return {
        optionalFields: false,
        total: false,
        comments: false,
        docstrings: false,
        extraSpacing: false,
      } satisfies PythonTypedDictOptions;
    }
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
  go: LanguageTypeSettings & { selectedType: GOTypes };
  python: LanguageTypeSettings & { selectedType: PythonTypes };
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
    selectedType: 'dto',
    typeConfigs: {
      record: getDefaultTypeConfig('csharp', 'record'),
      dto: getDefaultTypeConfig('csharp', 'dto'),
    },
  },
  go: {
    selectedType: 'struct',
    typeConfigs: {
      record: getDefaultTypeConfig('go', 'struct'),
      dto: getDefaultTypeConfig('go', 'dto'),
    },
  },
  python: {
    selectedType: 'dataclass',
    typeConfigs: {
      record: getDefaultTypeConfig('python', 'dataclass'),
      pydantic: getDefaultTypeConfig('python', 'pydantic'),
      class: getDefaultTypeConfig('python', 'class'),
      typed_dict: getDefaultTypeConfig('python', 'typed_dict'),
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
