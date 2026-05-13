import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Search,
  Users,
  ShieldCheck,
  UserCheck,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/entities';
import type { User as UserType } from '@/entities';
import type { UserFormValues } from '@/entities';
import { useDebounce } from '@/shared';
import { UserList, UserDetailModal } from '@/widgets';
import { UserFormModal, UserDeleteConfirm } from '@/features';

type SortField = 'firstName' | 'lastName' | 'age' | 'email' | 'role';

export const DashboardPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'moderator' | 'user'>('all');
  const [sortBy, setSortBy] = useState<SortField>('firstName');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);

  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formUser, setFormUser] = useState<UserType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserType | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', { limit, skip, search: debouncedSearch, role: roleFilter, sortBy, order }],
    queryFn: () =>
      fetchUsers({
        limit,
        skip,
        search: debouncedSearch,
        role: roleFilter,
        sortBy,
        order,
      }),
  });

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const page = Math.floor(skip / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success(t('toasts.userCreated'));
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsFormOpen(false);
    },
    onError: () => {
      toast.error(t('toasts.createError'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UserFormValues }) => updateUser(id, payload),
    onSuccess: () => {
      toast.success(t('toasts.userUpdated'));
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsFormOpen(false);
    },
    onError: () => {
      toast.error(t('toasts.updateError'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success(t('toasts.userDeleted'));
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error(t('toasts.deleteError'));
    },
  });

  const stats = useMemo(() => {
    return {
      total,
      admin: users.filter((u) => u.role === 'admin').length,
      moderator: users.filter((u) => u.role === 'moderator').length,
      user: users.filter((u) => u.role === 'user').length,
    };
  }, [users, total]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setOrder('asc');
    }
    setSkip(0);
  };

  const handleSubmitForm = (values: UserFormValues) => {
    if (formUser) {
      updateMutation.mutate({ id: formUser.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  };

  const goToPage = (p: number) => {
    setSkip((p - 1) * limit);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('dashboard.title')}</h2>
          <p className="text-muted-foreground mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <button
          onClick={() => {
            setFormUser(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t('header.addUser')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title={t('dashboard.stats.total')} value={stats.total} icon={<Users className="h-5 w-5 text-primary" />} />
        <StatCard title={t('dashboard.stats.admins')} value={stats.admin} icon={<ShieldCheck className="h-5 w-5 text-red-500" />} />
        <StatCard title={t('dashboard.stats.moderators')} value={stats.moderator} icon={<UserCheck className="h-5 w-5 text-amber-500" />} />
        <StatCard title={t('dashboard.stats.users')} value={stats.user} icon={<User className="h-5 w-5 text-emerald-500" />} />
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('dashboard.searchPlaceholder')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSkip(0);
            }}
            className="w-full rounded-lg border bg-background py-2 pl-9 pr-4 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'admin', 'moderator', 'user'] as const).map((role) => (
            <button
              key={role}
              onClick={() => {
                setRoleFilter(role);
                setSkip(0);
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                roleFilter === role
                  ? 'bg-primary text-primary-foreground'
                  : 'border bg-card hover:bg-muted'
              }`}
            >
              {role === 'all'
                ? t('dashboard.filters.all')
                : role === 'admin'
                ? t('dashboard.filters.admins')
                : role === 'moderator'
                ? t('dashboard.filters.moderators')
                : t('dashboard.filters.users')}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <span>{t('dashboard.sort.label')}</span>
        {(
          [
            { field: 'firstName' as SortField, label: t('dashboard.sort.firstName') },
            { field: 'lastName' as SortField, label: t('dashboard.sort.lastName') },
            { field: 'age' as SortField, label: t('dashboard.sort.age') },
            { field: 'email' as SortField, label: t('dashboard.sort.email') },
            { field: 'role' as SortField, label: t('dashboard.sort.role') },
          ] as const
        ).map(({ field, label }) => (
          <button
            key={field}
            onClick={() => handleSort(field)}
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
              sortBy === field ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-muted'
            }`}
          >
            {label}
            {sortBy === field ? (
              order === 'asc' ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-50" />
            )}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          {t('dashboard.loading')}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
          {t('dashboard.error')}
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <UserList
            users={users}
            onSelect={setSelectedUser}
            onEdit={(user) => {
              setFormUser(user);
              setIsFormOpen(true);
            }}
            onDelete={setDeleteTarget}
          />

          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{t('dashboard.pagination.show')}:</span>
              {[5, 10, 20, 30].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setLimit(n);
                    setSkip(0);
                  }}
                  className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                    limit === n ? 'bg-primary text-primary-foreground' : 'border bg-card hover:bg-muted'
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="ml-2">
                {total > 0 ? `${skip + 1}–${Math.min(skip + limit, total)} ${t('dashboard.pagination.of')} ${total}` : '0'}
              </span>
            </div>

            <div className="inline-flex items-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={page <= 1}
                className="rounded-md border p-1.5 hover:bg-muted disabled:opacity-40"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="rounded-md border p-1.5 hover:bg-muted disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 text-sm">
                {t('dashboard.pagination.page')} {page} / {totalPages}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="rounded-md border p-1.5 hover:bg-muted disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={page >= totalPages}
                className="rounded-md border p-1.5 hover:bg-muted disabled:opacity-40"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}

      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />

      {isFormOpen && (
        <UserFormModal
          user={formUser}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitForm}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <UserDeleteConfirm
        user={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isSubmitting={deleteMutation.isPending}
      />
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
