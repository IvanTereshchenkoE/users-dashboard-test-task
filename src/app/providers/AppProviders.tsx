import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { queryClient } from '@/shared';

interface Props {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
        <Toaster position="top-right" richColors closeButton duration={4000} />
      </BrowserRouter>
    </QueryClientProvider>
  );
};
