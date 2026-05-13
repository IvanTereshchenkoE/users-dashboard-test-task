import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const Header = () => {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const next = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(next);
  };

  return (
    <header className="border-b bg-card px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            D
          </div>
          <h1 className="text-lg font-semibold tracking-tight">{t('header.title')}</h1>
        </div>
        <button
          onClick={toggleLang}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          <Globe className="h-4 w-4" />
          {i18n.language === 'ru' ? 'RU' : 'EN'}
        </button>
      </div>
    </header>
  );
};
