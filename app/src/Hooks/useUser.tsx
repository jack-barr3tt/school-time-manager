import { createContext, ReactNode, useContext, useState } from "react";
import AxiosBase from "../API/AxiosBase";
import useLocalStorage from "./useLocalStorage";

interface UserValue {
    userId: number
    login: (email: string, password: string) => Promise<boolean>
    accessToken: string
    isAuth: boolean
    logout: () => void
}

const UserContext = createContext<UserValue|undefined>(undefined)

export function useUser () { 
    const context = useContext(UserContext) 
    if(!context) throw new Error("No user context")
    return context
}

export function UserProvider (props: { children: ReactNode }) {
    const { children } = props

    const [userId, setUserId] = useState<number>()
    const [accessToken, setAccessToken] = useLocalStorage<string>({ key : 'accessToken', initialValue: '' })
    const [isAuth, setIsAuth] = useState(false)

    const login = async (email: string, password: string) => {
        // Send email and password to backend for validation
        const { data } = await AxiosBase.post('/users/login', { email, password })
        // If successful, set userId, accessToken and isAuth
        setUserId(data.id)
        setAccessToken(data.token)
        setIsAuth(true)
        return true
    }

    const logout = () => {
        setUserId(undefined)
        setAccessToken('')
        setIsAuth(false)
    }

    const value = {
        get userId() { 
            if(!userId) throw new Error("No user ID")
            return userId
        },
        login,
        accessToken,
        isAuth,
        logout
    }

    // All components that use this context will have access to its value
    return <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
}
