import { useTranslation } from 'react-i18next';
import type { User } from '@/entities';
import { X, Mail, Phone, MapPin, Briefcase, GraduationCap, Calendar, Ruler, Weight, Droplet } from 'lucide-react';

interface Props {
  user: User | null;
  onClose: () => void;
}

export const UserDetailModal = ({ user, onClose }: Props) => {
  const { t } = useTranslation();
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title={t('userDetail.close')}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
          />
          <div>
            <h2 className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>

        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-primary" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-primary" />
            <span>{user.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-primary" />
            <span>
              {user.address.city}, {user.address.state}, {user.address.country}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase className="h-4 w-4 text-primary" />
            <span>
              {user.company.title} {t('dashboard.table.at') ?? 'at'} {user.company.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>{user.university}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{user.birthDate} ({user.age})</span>
          </div>
          <div className="flex items-center gap-3">
            <Ruler className="h-4 w-4 text-primary" />
            <span>{user.height} см</span>
          </div>
          <div className="flex items-center gap-3">
            <Weight className="h-4 w-4 text-primary" />
            <span>{user.weight} кг</span>
          </div>
          <div className="flex items-center gap-3">
            <Droplet className="h-4 w-4 text-primary" />
            <span>{t('userDetail.bloodGroup')}: {user.bloodGroup}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
