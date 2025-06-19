// Context para el manejo global del idioma seleccionado

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Language,
  getTranslations,
  getStoredLanguage,
  setStoredLanguage,
  Translations,
} from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (language: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage());
  const [translations, setTranslations] = useState<Translations>(
    getTranslations(language),
  );

  // Función para cambiar idioma
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    setStoredLanguage(newLanguage);
    setTranslations(getTranslations(newLanguage));

    // Disparar evento personalizado para notificar cambio de idioma
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language: newLanguage },
      }),
    );
  };

  // Inicializar traducciones al montar el componente
  useEffect(() => {
    setTranslations(getTranslations(language));
  }, [language]);

  // Escuchar cambios de idioma desde otros componentes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const newLanguage = event.detail.language;
      if (newLanguage !== language) {
        setLanguageState(newLanguage);
        setTranslations(getTranslations(newLanguage));
      }
    };

    window.addEventListener(
      "languageChanged",
      handleLanguageChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "languageChanged",
        handleLanguageChange as EventListener,
      );
    };
  }, [language]);

  const value: LanguageContextType = {
    language,
    translations,
    setLanguage,
    t: translations, // Alias para facilitar el uso
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para usar el contexto de idioma
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Hook adicional que solo devuelve las traducciones (más conveniente)
export const useTranslations = (): Translations => {
  const { translations } = useLanguage();
  return translations;
};

// Hook para obtener una traducción específica con tipo de seguridad
export const useT = () => {
  const { translations } = useLanguage();
  return translations;
};
