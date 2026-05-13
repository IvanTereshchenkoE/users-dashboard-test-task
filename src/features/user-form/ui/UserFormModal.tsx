import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import type { User } from '@/entities';
import { userFormSchema, type UserFormValues } from '@/entities';

interface Props {
  user: User | null;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
  isSubmitting: boolean;
}

export const UserFormModal = ({ user, onClose, onSubmit, isSubmitting }: Props) => {
  const isEdit = !!user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: 18,
      gender: 'male',
      username: '',
      birthDate: '',
      role: 'user',
      companyName: '',
      companyTitle: '',
      city: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender as 'male' | 'female' | 'other',
        username: user.username,
        birthDate: user.birthDate,
        role: user.role,
        companyName: user.company.name,
        companyTitle: user.company.title,
        city: user.address.city,
      });
    } else {
      reset();
    }
  }, [user, reset]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-6">
          {isEdit ? 'Редактирование пользователя' : 'Новый пользователь'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          <Field label="Имя" error={errors.firstName?.message}>
            <input {...register('firstName')} className="input" placeholder="Имя" />
          </Field>
          <Field label="Фамилия" error={errors.lastName?.message}>
            <input {...register('lastName')} className="input" placeholder="Фамилия" />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input {...register('email')} className="input" placeholder="email@example.com" />
          </Field>
          <Field label="Телефон" error={errors.phone?.message}>
            <input {...register('phone')} className="input" placeholder="+7 999 999-99-99" />
          </Field>
          <Field label="Возраст" error={errors.age?.message}>
            <input type="number" {...register('age')} className="input" />
          </Field>
          <Field label="Пол" error={errors.gender?.message}>
            <select {...register('gender')} className="input">
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
              <option value="other">Другой</option>
            </select>
          </Field>
          <Field label="Username" error={errors.username?.message}>
            <input {...register('username')} className="input" placeholder="username" />
          </Field>
          <Field label="Дата рождения" error={errors.birthDate?.message}>
            <input type="date" {...register('birthDate')} className="input" />
          </Field>
          <Field label="Роль" error={errors.role?.message}>
            <select {...register('role')} className="input">
              <option value="user">Пользователь</option>
              <option value="moderator">Модератор</option>
              <option value="admin">Администратор</option>
            </select>
          </Field>
          <Field label="Город" error={errors.city?.message}>
            <input {...register('city')} className="input" placeholder="Город" />
          </Field>
          <Field label="Компания" error={errors.companyName?.message}>
            <input {...register('companyName')} className="input" placeholder="Название компании" />
          </Field>
          <Field label="Должность" error={errors.companyTitle?.message}>
            <input {...register('companyTitle')} className="input" placeholder="Должность" />
          </Field>

          <div className="col-span-full mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--border));
          background-color: hsl(var(--background));
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: box-shadow 0.15s;
        }
        .input:focus {
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.3);
          border-color: hsl(var(--ring));
        }
      `}</style>
    </div>
  );
};

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
