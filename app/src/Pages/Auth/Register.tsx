import { Button, Stack, TextField } from '@mui/material'
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '../../API/Users'
import NavBar from '../../Components/NavBar'
import { useUser } from '../../Hooks/useUser'

export default function Register() {
    const [email, setEmail] = useState<string>()
    const [username, setUsername] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [passwordConfirm, setPasswordConfirm] = useState<string>()

    const { login } = useUser()
    const navigate = useNavigate()

    const RegisterUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(email && username && password && passwordConfirm) {
            try{
                await User.register(email, username, password)
                if(login && await login(email, password)) navigate("/")
            }catch{}
        }
    }
    
    return <>
        <NavBar name="Register"/>
        <form onSubmit={RegisterUser}>
            <Stack direction="column" spacing={2}>
                <TextField label="Email" fullWidth autoFocus onChange={(e) => setEmail(e.target.value)}/>
                <TextField label="Username" fullWidth autoFocus onChange={(e) => setUsername(e.target.value)}/>
                <TextField label="Password" fullWidth type="password" onChange={(e) => setPassword(e.target.value)}/>
                <TextField label="Confirm Password" fullWidth type="password" onChange={(e) => setPasswordConfirm(e.target.value)}/>
                <Button color="secondary" variant="contained" type="submit" fullWidth>Register</Button>
            </Stack>
        </form>
    </>
}
