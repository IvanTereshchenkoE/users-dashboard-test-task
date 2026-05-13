import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Users, ShieldCheck, UserCheck, User } from 'lucide-react';
import { fetchUsers } from '@/entities/user/api/usersApi';
import type { User as UserType } from '@/entities/user/model/types';
import { UserList } from '@/widgets/user-list/ui/UserList';
import { UserDetailModal } from '@/widgets/user-detail-modal/ui/UserDetailModal';

export const DashboardPage = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'moderator' | 'user'>('all');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const users = data?.users ?? [];

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        `${u.firstName} ${u.lastName} ${u.email} ${u.username}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      admin: users.filter((u) => u.role === 'admin').length,
      moderator: users.filter((u) => u.role === 'moderator').length,
      user: users.filter((u) => u.role === 'user').length,
    };
  }, [users]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Пользователи</h2>
        <p className="text-muted-foreground mt-1">Управление и просмотр пользователей системы</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Всего" value={stats.total} icon={<Users className="h-5 w-5 text-primary" />} />
        <StatCard title="Администраторы" value={stats.admin} icon={<ShieldCheck className="h-5 w-5 text-red-500" />} />
        <StatCard title="Модераторы" value={stats.moderator} icon={<UserCheck className="h-5 w-5 text-amber-500" />} />
        <StatCard title="Пользователи" value={stats.user} icon={<User className="h-5 w-5 text-emerald-500" />} />
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск по имени, email или username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-background py-2 pl-9 pr-4 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'admin', 'moderator', 'user'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                roleFilter === role
                  ? 'bg-primary text-primary-foreground'
                  : 'border bg-card hover:bg-muted'
              }`}
            >
              {role === 'all' ? 'Все' : role === 'admin' ? 'Админы' : role === 'moderator' ? 'Модераторы' : 'Юзеры'}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          Загрузка пользователей...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
          Не удалось загрузить пользователей. Попробуйте позже.
        </div>
      )}

      {!isLoading && !isError && <UserList users={filteredUsers} onSelect={setSelectedUser} />}

      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
};

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        <div className="rounded-lg bg-muted p-2.5">{icon}</div>
      </div>
    </div>
  );
}
