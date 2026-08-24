import axios from 'axios';
import { createApi } from '../integration/httpClient';

const authApi = createApi(
  `${process.env.EXPO_PUBLIC_LOCAL_API_URL}/fatec/login/v1`
);

const api = createApi(
  `${process.env.EXPO_PUBLIC_LOCAL_API_URL}/api-pokemon/auth/v1`
);

export type TokenResponse = {
  token: string;
  userId: string;
  username: string;
};

export type RegistroRequest = {
  username: string;
  password: string;
  email: string;
  cep: string;
  roles: string[];
}

export type AuthRequest = {
  username: string;
  password: string;
};

export type AuthResponse = {
    token: string;
    userId: string;
    username: string;
};

export type StatsResponse = {
  userId: string;
  username: string;
  level: number;
  vitorias: number;
  derrotas: number;
};

export type UpdateStatsRequest = {
  level: string;
  vitorias: string;
  derrotas: string;
};

export type TeamUpdateRequest = {
  removedPokemon: number;
  newPokemon: number;
};

// ===== AUTH =====

export const register = async (data: RegistroRequest): Promise<void> => {
    await authApi.post('/user/save', data);
};

export const login = async (data: AuthRequest): Promise<TokenResponse> => {
  const response = await authApi.post('/auth', data);
  return response.data;
};

export const getProfile = async (userId: string): Promise<StatsResponse> => {
  const response = await authApi.get(`/stats/${userId}`);
  return response.data;
};

export const updateProfile = async (
  userId: string,
  data: UpdateStatsRequest
): Promise<StatsResponse> => {
  // Antes: usava `api` (base /api-pokemon/auth/v1) + '/auth/v1/stats/...',
  // o que gerava um path duplicado e errado. O endpoint de stats mora
  // no backend "fatec/login/v1" (mesmo do login/cadastro), então usa `authApi`.
  const response = await authApi.put(`/stats/${userId}`, data);
  return response.data;
};

// ===== POKÉMON =====

export const getTeam = async (userId: string) => {
  const response = await api.get('/pokemon/v1/team', {
    params: { 'user-id': userId },
  });
  return response.data;
};

export const updateTeam = async (userId: string, data: TeamUpdateRequest) => {
  const response = await api.put('/pokemon/v1/team', data, {
    params: { 'user-id': userId },
  });
  return response.data;
};

export const addCaptured = async (userId: string, pokemonId: number) => {
  const response = await api.put('/pokemon/v1/captured', null, {
    params: { 'user-id': userId, 'pokemon-id': pokemonId },
  });
  return response.data;
};

export const deleteCaptured = async (userId: string, pokemonId: number) => {
  const response = await api.delete('/pokemon/v1/captured', {
    params: { 'user-id': userId, 'pokemon-id': pokemonId },
  });
  return response.data;
};