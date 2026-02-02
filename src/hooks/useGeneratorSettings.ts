import { useState, useEffect, useCallback } from 'react';
import type {
  GeneratorSettings,
  SupportedLanguage,
  LanguageType,
  TypeConfig,
} from '@/types/generator.types';
import { DEFAULT_GENERATOR_SETTINGS, getDefaultTypeConfig } from '@/types/generator.types';

const STORAGE_KEY = 'typegen-generator-settings-v2';

function ensureLanguageSettings<T extends SupportedLanguage>(
  languageSettings: GeneratorSettings[T] | undefined,
  language: T,
): GeneratorSettings[T] {
  const defaultSettings = DEFAULT_GENERATOR_SETTINGS[language];
  const typeConfigs = { ...defaultSettings.typeConfigs };

  if (languageSettings?.typeConfigs) {
    Object.keys(languageSettings.typeConfigs).forEach((type) => {
      if (typeConfigs[type]) {
        typeConfigs[type] = {
          ...typeConfigs[type],
          ...languageSettings.typeConfigs[type],
        };
      }
    });
  }

  return {
    selectedType: languageSettings?.selectedType ?? defaultSettings.selectedType,
    typeConfigs,
  } as GeneratorSettings[T];
}

export function useGeneratorSettings() {
  const [settings, setSettings] = useState<GeneratorSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          java: ensureLanguageSettings(parsed.java, 'java'),
          typescript: ensureLanguageSettings(parsed.typescript, 'typescript'),
          csharp: ensureLanguageSettings(parsed.csharp, 'csharp'),
        };
      }
    } catch (e) {
      console.error('Failed to parse generator settings:', e);
    }
    return DEFAULT_GENERATOR_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSelectedType = useCallback((language: SupportedLanguage, type: LanguageType) => {
    setSettings((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        selectedType: type,
      },
    }));
  }, []);

  const updateTypeConfig = useCallback(
    (language: SupportedLanguage, type: LanguageType, updates: Partial<TypeConfig>) => {
      setSettings((prev) => {
        const currentTypeConfigs = prev[language].typeConfigs;
        const currentConfig = currentTypeConfigs[type] || getDefaultTypeConfig(language, type);

        return {
          ...prev,
          [language]: {
            ...prev[language],
            typeConfigs: {
              ...currentTypeConfigs,
              [type]: {
                ...currentConfig,
                ...updates,
              },
            },
          },
        };
      });
    },
    [],
  );

  const getTypeConfig = useCallback(
    (language: SupportedLanguage, type: LanguageType): TypeConfig => {
      const typeConfigs = settings[language].typeConfigs;
      return typeConfigs[type] || getDefaultTypeConfig(language, type);
    },
    [settings],
  );

  const getSelectedType = useCallback(
    (language: SupportedLanguage): LanguageType => {
      return settings[language].selectedType;
    },
    [settings],
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_GENERATOR_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const resetLanguageSettings = useCallback((language: SupportedLanguage) => {
    setSettings((prev) => ({
      ...prev,
      [language]: DEFAULT_GENERATOR_SETTINGS[language],
    }));
  }, []);

  const resetTypeSettings = useCallback((language: SupportedLanguage, type: LanguageType) => {
    setSettings((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        typeConfigs: {
          ...prev[language].typeConfigs,
          [type]: getDefaultTypeConfig(language, type),
        },
      },
    }));
  }, []);

  return {
    settings,
    updateSelectedType,
    updateTypeConfig,
    getTypeConfig,
    getSelectedType,
    resetSettings,
    resetLanguageSettings,
    resetTypeSettings,
  };
}
