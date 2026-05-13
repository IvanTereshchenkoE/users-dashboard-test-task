import axios from 'axios';
import type { UsersResponse, User, CreateUserPayload } from '../model/types';

const API_URL = 'https://dummyjson.com/users';

export interface FetchUsersParams {
  limit?: number;
  skip?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  role?: 'all' | 'admin' | 'moderator' | 'user';
}

export async function fetchUsers(params: FetchUsersParams = {}): Promise<UsersResponse> {
  const { limit = 10, skip = 0, search, sortBy, order, role } = params;

  if (search && search.trim()) {
    const { data } = await axios.get<UsersResponse>(`${API_URL}/search`, {
      params: { q: search.trim(), limit, skip, sortBy, order },
    });
    return data;
  }

  if (role && role !== 'all') {
    const { data } = await axios.get<UsersResponse>(`${API_URL}/filter`, {
      params: { key: 'role', value: role, limit, skip, sortBy, order },
    });
    return data;
  }

  const { data } = await axios.get<UsersResponse>(API_URL, {
    params: { limit, skip, sortBy, order },
  });
  return data;
}

export async function fetchUserById(id: number): Promise<User> {
  const { data } = await axios.get<User>(`${API_URL}/${id}`);
  return data;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await axios.post<User>(`${API_URL}/add`, {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    age: payload.age,
    gender: payload.gender,
    username: payload.username,
    birthDate: payload.birthDate,
    role: payload.role,
    company: { name: payload.companyName, title: payload.companyTitle },
    address: { city: payload.city },
  });
  return data;
}

export async function updateUser(id: number, payload: CreateUserPayload): Promise<User> {
  const { data } = await axios.put<User>(`${API_URL}/${id}`, {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    age: payload.age,
    gender: payload.gender,
    username: payload.username,
    birthDate: payload.birthDate,
    role: payload.role,
    company: { name: payload.companyName, title: payload.companyTitle },
    address: { city: payload.city },
  });
  return data;
}

export async function deleteUser(id: number): Promise<User> {
  const { data } = await axios.delete<User>(`${API_URL}/${id}`);
  return data;
}
