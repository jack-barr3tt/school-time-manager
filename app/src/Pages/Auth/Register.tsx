import { Button, Stack, TextField, Typography } from '@mui/material'
import { AxiosError } from 'axios'
import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '../../API/Users'
import NavBar from '../../Components/NavBar'
import { useUser } from '../../Hooks/useUser'

export default function Register() {
    const [email, setEmail] = useState<string>()
    const [username, setUsername] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [passwordConfirm, setPasswordConfirm] = useState<string>()
    const [error, setError] = useState<string>()
    const [errorElements, setErrorElements] = useState<number[]>([])

    useEffect(() => {
        setError(undefined) 
        setErrorElements([])
    }, [email, username, password, passwordConfirm])

    const { login } = useUser()
    const navigate = useNavigate()

    const RegisterUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let tempErrors = []

        if(!email) tempErrors.push(0)
        if(!username) tempErrors.push(1)
        if(!password) tempErrors.push(2)
        if(!passwordConfirm) tempErrors.push(3)

        setErrorElements(tempErrors)

        if(email && username && password && passwordConfirm) {
            if(password !== passwordConfirm) {
                console.log("passwords don't match")
                setError("Passwords do not match.")
                setErrorElements([2,3])
                return
            }
            try{
                await User.register(email, username, password)
                if(login && await login(email, password)) navigate("/")
            }catch(err){
                const { response } = err as AxiosError
                if(!response) return
                const { message } = response.data as { message: string }
                setError(message)
                if(message === "Invalid email") setErrorElements([0])
                if(message.startsWith("Key (email)=(")) {
                    setError("Email already in use.")
                    setErrorElements([0])
                }
            }
        }else{
            setError("Please fill out all fields.")
        }
    }
    
    return <>
        <NavBar name="Register"/>
        <form onSubmit={RegisterUser}>
            <Stack direction="column" spacing={2}>
                <TextField 
                    label="Email" 
                    fullWidth 
                    autoFocus 
                    onChange={(e) => setEmail(e.target.value)}
                    error={errorElements.includes(0)}
                />
                
                <TextField 
                    label="Username"
                    fullWidth
                    autoFocus 
                    onChange={(e) => setUsername(e.target.value)}
                    error={errorElements.includes(1)}
                />

                <TextField 
                    label="Password"
                    fullWidth 
                    type="password" 
                    onChange={(e) => setPassword(e.target.value)}
                    error={errorElements.includes(2)}
                />
                
                <TextField 
                    label="Confirm Password"
                    fullWidth 
                    type="password"
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    error={errorElements.includes(3)}
                />

                <Button color="secondary" variant="contained" type="submit" fullWidth>Register</Button>
                { error && <Typography color="error.main" variant="body1">{error}</Typography> }
            </Stack>
        </form>
    </>
}
