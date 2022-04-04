import { Stack, TextField, Button } from "@mui/material"
import { useState, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "../../Components/NavBar"
import { useUser } from "../../Hooks/useUser"

export default function Login() {
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()

    const { login } = useUser()

    const navigate = useNavigate()

    const LoginUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(email && password && login) {
            if(await login(email, password)) navigate("/")
        }
    }

    return <>
        <NavBar name="Login"/>
        <form onSubmit={LoginUser}>
            <Stack direction="column" spacing={2}>
                <TextField label="Email" fullWidth autoFocus onChange={(e) => setEmail(e.target.value)}/>
                <TextField label="Password" fullWidth type="password" onChange={(e) => setPassword(e.target.value)}/>
                <Button color="secondary" variant="contained" type="submit">Login</Button>
                <Button onClick={() => navigate("/register")}>Register</Button>      
            </Stack>
        </form>
    </>
}