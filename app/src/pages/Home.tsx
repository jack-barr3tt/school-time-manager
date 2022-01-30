import { Button, Paper, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate()

    return <>
        <Paper sx={{ backgroundImage: "linear-gradient(#c2e7ff, white)", p: 3, width: "100%", position: "absolute", left: 0, top: 0 }} elevation={0}/>
        <Typography variant="h5" textAlign="center" sx={{ zIndex: 1 }}>Welcome</Typography>
        <Button variant="outlined" fullWidth onClick={() => navigate("timetable")}>Timetable</Button>
        <Button variant="outlined" fullWidth onClick={() => navigate("homework")}>Homework</Button>
        <Button variant="outlined" fullWidth onClick={() => navigate("setup")}>Setup</Button>
    </>
}
