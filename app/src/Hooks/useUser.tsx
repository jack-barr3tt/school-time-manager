import axios, { AxiosRequestConfig } from "axios";
import { createContext, ReactNode, useContext, useState } from "react";
import { User } from "../API/Users";
import useLocalStorage from "./useLocalStorage";

interface UserValue {
    data: User;
    login: (email: string, password: string) => Promise<void>;
    accessToken: string;
    formatAccessToken: () => AxiosRequestConfig;
    isAuth: boolean;
    logout: () => void;
}

const UserContext = createContext<Partial<UserValue>>({});

export function useUser () { return useContext(UserContext) }

export function UserProvider (props: { children: ReactNode }) {
    const { children } = props;

    const [user, setUser] = useState<User>()
    const [accessToken, setAccessToken] = useLocalStorage<string>({ key : 'accessToken', initialValue: '' })
    const [isAuth, setIsAuth] = useState(!!accessToken)

    const login = async (email: string, password: string) => {
        try {
            const { data } = await axios.post('http://localhost:3000/users/login', { email, password })
            setUser(data)
            setAccessToken(data.accessToken)
            setIsAuth(true)
        }catch{}
    }

    const logout = () => {
        setUser(undefined)
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
        data: user,
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
