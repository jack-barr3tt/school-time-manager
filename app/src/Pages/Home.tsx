import { Button, Paper, Typography, useTheme } from '@mui/material';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../App';

export default function Home() {
    const navigate = useNavigate()
    const theme = useTheme()

    const user = useContext(userContext)

    return <>
        <Paper sx={{ backgroundImage: `linear-gradient(${theme.palette.secondary.main}, ${theme.palette.background.default})`, p: 3, width: "100%", position: "absolute", left: 0, top: 0 }} elevation={0}/>
        <Typography variant="h5" textAlign="center" sx={{ zIndex: 1 }}>{user.username ? `Welcome, ${user.username}` : "Welcome"}</Typography>
        <Button variant="outlined" fullWidth onClick={() => navigate("timetable")}>Timetable</Button>
        <Button variant="outlined" fullWidth onClick={() => navigate("homework")}>Homework</Button>
        <Button variant="outlined" fullWidth onClick={() => navigate("setup")}>Setup</Button>
    </>
}