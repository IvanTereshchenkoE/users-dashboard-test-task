import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import { DashboardPage } from '@/pages/dashboard/ui/DashboardPage';

export const App = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-card px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            D
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Дашборд пользователей</h1>
        </div>
      </header>
      <main className="flex-1 bg-background">
        <Routes>
          <Route path={ROUTES.HOME} element={<DashboardPage />} />
        </Routes>
      </main>
      <footer className="border-t bg-card px-6 py-4 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-7xl">
          Данные предоставлены dummyjson.com
        </div>
      </footer>
    </div>
  );
};
