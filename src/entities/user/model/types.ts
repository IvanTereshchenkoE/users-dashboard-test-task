export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    country: string;
  };
  university: string;
  company: {
    department: string;
    name: string;
    title: string;
  };
  role: 'admin' | 'moderator' | 'user';
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  username: string;
  birthDate: string;
  role: 'admin' | 'moderator' | 'user';
  companyName: string;
  companyTitle: string;
  city: string;
}

export interface UpdateUserPayload extends CreateUserPayload {}
