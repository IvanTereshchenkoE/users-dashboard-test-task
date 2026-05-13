import { useTranslation } from 'react-i18next';
import type { User } from '@/entities';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface Props {
  users: User[];
  onSelect: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const roleStyles: Record<string, string> = {
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  moderator: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  user: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

export const UserList = ({ users, onSelect, onEdit, onDelete }: Props) => {
  const { t } = useTranslation();

  if (users.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        {t('dashboard.table.notFound')}
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('dashboard.table.user')}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('dashboard.table.email')}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('dashboard.table.age')}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('dashboard.table.city')}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('dashboard.table.company')}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('dashboard.table.role')}</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">{t('dashboard.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.image}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">{user.age}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.address.city}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.company.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      roleStyles[user.role] ?? 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => onSelect(user)}
                      className="rounded-md border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      title={t('dashboard.table.view')}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onEdit(user)}
                      className="rounded-md border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      title={t('dashboard.table.edit')}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="rounded-md border p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      title={t('dashboard.table.delete')}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
