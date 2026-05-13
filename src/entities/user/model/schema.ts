import { z } from 'zod';

export const userFormSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  email: z.string().email('Некорректный email'),
  phone: z.string().min(1, 'Телефон обязателен'),
  age: z.coerce.number().min(1, 'Возраст должен быть больше 0').max(150, 'Слишком большой возраст'),
  gender: z.enum(['male', 'female', 'other']),
  username: z.string().min(1, 'Username обязателен'),
  birthDate: z.string().min(1, 'Дата рождения обязательна'),
  role: z.enum(['admin', 'moderator', 'user']),
  companyName: z.string().min(1, 'Название компании обязательно'),
  companyTitle: z.string().min(1, 'Должность обязательна'),
  city: z.string().min(1, 'Город обязателен'),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
