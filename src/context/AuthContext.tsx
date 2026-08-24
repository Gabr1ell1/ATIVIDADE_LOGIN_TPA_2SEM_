import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { decodeToken, isTokenExpired } from "../utils/jwt";
import {
    login as loginApi,
    register,
    RegistroRequest,
    AuthRequest,
    TokenResponse
} from "@/services/pokemonApi";
import { setUnauthorizeHandler } from "@/integration/httpClient";

const testeAuth: AuthRequest = {
    username: "teste",
    password: "123"
};

const testeToken: TokenResponse = {
    token: "teste",
    userId: "123",
    username: "GG"
};

type AuthContextData = {
    isAuthenticated: boolean;
    user: string | null;
    userId: string | null;
    roles: string[] | null;
    isLoading: boolean;

    signIn: (
        username: string,
        password: string
    ) => Promise<{ ok: boolean; userId?: string }>;

    signUp: (
        data: RegistroRequest
    ) => Promise<{
        ok: boolean;
        userId?: string;
        error?: string;
    }>;

    signOut: () => void;
};

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [roles, setRoles] = useState<string[] | null>(null);
    const [token, setToken] = useState<string | null>(null);

    async function persistSession(
        newToken: string,
        username?: string,
        newUserId?: string
    ) {
        const payload = decodeToken(newToken);

        const id = newUserId ?? payload.sub;
        const name = username ?? payload.sub;

        setUser(name);
        setUserId(id);
        setRoles(payload.roles);
        setToken(newToken);
        setIsAuthenticated(true);

        await AsyncStorage.setItem("@Auth:user", name);
        await AsyncStorage.setItem("@Auth:token", newToken);
        await AsyncStorage.setItem("@Auth:userId", id);
    }

    async function clearSession() {
        setUser(null);
        setUserId(null);
        setRoles(null);
        setToken(null);
        setIsAuthenticated(false);

        await AsyncStorage.removeItem("@Auth:user");
        await AsyncStorage.removeItem("@Auth:token");
        await AsyncStorage.removeItem("@Auth:userId");
    }

    useEffect(() => {
        async function loadStorageData() {
            const storageToken =
                await AsyncStorage.getItem("@Auth:token");

            if (storageToken && !isTokenExpired(storageToken)) {
                // Antes: persistSession(storageToken) sem username/userId,
                // o que fazia cair no fallback payload.sub (o ID do Mongo)
                // e mostrar o ID no lugar do nome do usuário.
                const storedUsername =
                    await AsyncStorage.getItem("@Auth:user");
                const storedUserId =
                    await AsyncStorage.getItem("@Auth:userId");

                await persistSession(
                    storageToken,
                    storedUsername ?? undefined,
                    storedUserId ?? undefined
                );
            } else if (storageToken) {
                await clearSession();
            }

            setIsLoading(false);
        }

        loadStorageData();
    }, []);

    useEffect(() => {
        setUnauthorizeHandler(() => {
            clearSession();
            router.replace("/");
        });
    }, []);

    async function signIn(
    username: string,
    password: string
): Promise<{ ok: boolean; userId?: string }> {

    try {

        const data: AuthRequest = {
            username,
            password
        };

        const response: TokenResponse = await loginApi(data);

        await persistSession(
            response.token,
            response.username,
            response.userId
        );

        return {
            ok: true,
            userId: response.userId
        };

    } catch (error) {

        console.error("ERRO NO LOGIN:", error);

        return {
            ok: false
        };
    }
}

    async function signUp(
        data: RegistroRequest
    ): Promise<{
        ok: boolean;
        userId?: string;
        error?: string;
    }> {
        try {
            await register(data);

            return {
                ok: true
            };
        } catch (err: any) {
            const message =
                err.response?.data?.message ||
                "Erro desconhecido";

            return {
                ok: false,
                error: message
            };
        }
    }

    async function signOut() {
        await clearSession();
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                userId,
                roles,
                signIn,
                signUp,
                signOut,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);