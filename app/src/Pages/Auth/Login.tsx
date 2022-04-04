import { Stack, TextField, Button, Typography } from "@mui/material"
import { AxiosError } from "axios"
import { useState, FormEvent, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "../../Components/NavBar"
import { useUser } from "../../Hooks/useUser"

export default function Login() {
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [error, setError] = useState<string>()
    const [errorElements, setErrorElements] = useState<number[]>([])

    useEffect(() => {
        setError(undefined)
        setErrorElements([])    
    }, [email, password])

    const { login } = useUser()

    const navigate = useNavigate()

    const LoginUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(email && password && login) {
            try{
                if(await login(email, password)) navigate("/")
            }catch(err){
                const { response } = err as AxiosError
                if(!response) return
                const { message } = response.data as { message: string }
                
                setError(message)
                if(message === "User not found") setErrorElements([0])
                if(message === "Incorrect password") setErrorElements([1])
            }
        }
    }

    return <>
        <NavBar name="Login" backDisabled/>
        <form onSubmit={LoginUser}>
            <Stack direction="column" spacing={2} sx={{ height: 1 }}>
                <TextField 
                    label="Email" 
                    fullWidth 
                    autoFocus 
                    onChange={(e) => setEmail(e.target.value)}
                    error={errorElements.includes(0)}
                />
                
                <TextField 
                    label="Password"
                    fullWidth 
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    error={errorElements.includes(1)}
                />

                <Button color="secondary" variant="contained" type="submit">Login</Button>
                <Typography color="error.main" variant="body1" sx={{ height: "2rem" }}>{error}</Typography>
                <Button onClick={() => navigate("/register")}>Register</Button>      
            </Stack>
        </form>
    </>
}