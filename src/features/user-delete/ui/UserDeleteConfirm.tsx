import { useTranslation } from 'react-i18next';
import { AlertTriangle, X } from 'lucide-react';
import type { User } from '@/entities';

interface Props {
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export const UserDeleteConfirm = ({ user, onClose, onConfirm, isSubmitting }: Props) => {
  const { t } = useTranslation();
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold">{t('userDelete.title')}</h2>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {t('userDelete.description', { name: `${user.firstName} ${user.lastName}` })}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            {t('userDelete.cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? t('userDelete.confirmLoading') : t('userDelete.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};
