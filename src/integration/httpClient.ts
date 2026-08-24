import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UnauthorizeHandler = () => void;

let unauthorize: UnauthorizeHandler | null = null;

export function setUnauthorizeHandler(handler: UnauthorizeHandler) {
    unauthorize = handler;
}

export function createApi(baseURL: string) {
    const instance = axios.create({
        baseURL});

        instance.interceptors.request.use(async (config) => {
            const token = await AsyncStorage.getItem('@Auth:token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        instance.interceptors.response.use(
            (response) => response,
            (error) => {       
                if (error.response?.status === 401) {
                    unauthorize?.();
                }
                return Promise.reject(error);
            }
        );

    return instance;
}