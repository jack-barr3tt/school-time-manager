import { AxiosRequestConfig } from "axios";
import { createContext, ReactNode, useContext, useState } from "react";
import AxiosBase from "../API/AxiosBase";
import useLocalStorage from "./useLocalStorage";

interface UserValue {
    userId: number;
    login: (email: string, password: string) => Promise<boolean>;
    accessToken: string;
    formatAccessToken: () => AxiosRequestConfig;
    isAuth: boolean;
    logout: () => void;
}

const UserContext = createContext<Partial<UserValue>>({});

export function useUser () { return useContext(UserContext) }

export function UserProvider (props: { children: ReactNode }) {
    const { children } = props;

    const [userId, setUserId] = useState<number>();
    const [accessToken, setAccessToken] = useLocalStorage<string>({ key : 'accessToken', initialValue: '' })
    const [isAuth, setIsAuth] = useState(false)

    const login = async (email: string, password: string) => {
        try {
            const { data } = await AxiosBase.post('/users/login', { email, password })
            setUserId(data.id)
            setAccessToken(data.token)
            setIsAuth(true)
            return true
        }catch{ return false }
    }

    const logout = () => {
        setUserId(undefined)
        setAccessToken('')
        setIsAuth(false)
    }

    const formatAccessToken = () => {
        return {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    }

    const value = {
        userId,
        login,
        accessToken,
        formatAccessToken,
        isAuth,
        logout
    }

    return <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
}
