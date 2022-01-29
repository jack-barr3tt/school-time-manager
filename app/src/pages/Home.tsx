import { Button, Paper, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return <>
        <Paper sx={{ backgroundImage: "linear-gradient(#c2e7ff, white)", p: 3, width: "100%", position: "absolute", left: 0, top: 0 }} elevation={0}/>
        <Typography variant="h5" textAlign="center" sx={{ zIndex: 1 }}>Welcome</Typography>
        <Link to="timetable">
            <Button variant="outlined" fullWidth>Timetable</Button>
        </Link>
        <Link to="homework">
            <Button variant="outlined" fullWidth>Homework</Button>
        </Link>
        <Link to="setup">
            <Button variant="outlined" fullWidth>Setup</Button>
        </Link>
    </>
}
