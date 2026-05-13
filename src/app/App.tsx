import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/shared';
import { DashboardPage } from '@/pages';
import { Header } from '@/widgets';

export const App = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <Routes>
          <Route path={ROUTES.HOME} element={<DashboardPage />} />
        </Routes>
      </main>
      <footer className="border-t bg-card px-6 py-4 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-7xl">{t('footer.text')}</div>
      </footer>
    </div>
  );
};
