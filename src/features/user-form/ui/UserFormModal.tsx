import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          {isEdit ? t('userForm.editTitle') : t('userForm.createTitle')}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          <Field label={t('userForm.firstName')} error={errors.firstName?.message}>
            <input {...register('firstName')} className="input" placeholder={t('userForm.firstName')} />
          </Field>
          <Field label={t('userForm.lastName')} error={errors.lastName?.message}>
            <input {...register('lastName')} className="input" placeholder={t('userForm.lastName')} />
          </Field>
          <Field label={t('userForm.email')} error={errors.email?.message}>
            <input {...register('email')} className="input" placeholder="email@example.com" />
          </Field>
          <Field label={t('userForm.phone')} error={errors.phone?.message}>
            <input {...register('phone')} className="input" placeholder="+7 999 999-99-99" />
          </Field>
          <Field label={t('userForm.age')} error={errors.age?.message}>
            <input type="number" {...register('age')} className="input" />
          </Field>
          <Field label={t('userForm.gender')} error={errors.gender?.message}>
            <select {...register('gender')} className="input">
              <option value="male">{t('userForm.genderOptions.male')}</option>
              <option value="female">{t('userForm.genderOptions.female')}</option>
              <option value="other">{t('userForm.genderOptions.other')}</option>
            </select>
          </Field>
          <Field label={t('userForm.username')} error={errors.username?.message}>
            <input {...register('username')} className="input" placeholder="username" />
          </Field>
          <Field label={t('userForm.birthDate')} error={errors.birthDate?.message}>
            <input type="date" {...register('birthDate')} className="input" />
          </Field>
          <Field label={t('userForm.role')} error={errors.role?.message}>
            <select {...register('role')} className="input">
              <option value="user">{t('userForm.roleOptions.user')}</option>
              <option value="moderator">{t('userForm.roleOptions.moderator')}</option>
              <option value="admin">{t('userForm.roleOptions.admin')}</option>
            </select>
          </Field>
          <Field label={t('userForm.city')} error={errors.city?.message}>
            <input {...register('city')} className="input" placeholder={t('userForm.city')} />
          </Field>
          <Field label={t('userForm.companyName')} error={errors.companyName?.message}>
            <input {...register('companyName')} className="input" placeholder={t('userForm.companyName')} />
          </Field>
          <Field label={t('userForm.companyTitle')} error={errors.companyTitle?.message}>
            <input {...register('companyTitle')} className="input" placeholder={t('userForm.companyTitle')} />
          </Field>

          <div className="col-span-full mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              {t('userForm.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? t('userForm.submitLoading') : isEdit ? t('userForm.submitEdit') : t('userForm.submitCreate')}
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
