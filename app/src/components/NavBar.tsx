import React, { FC } from 'react';
import { IconButton, Paper, Stack, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { useLocation, useNavigate } from 'react-router-dom';

export const NavBar : FC<{ name: string }> = ({ name }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const navigateBack = () => {
        navigate("/" + location.pathname.split("/").filter(x => x.length > 1).slice(0, -1).join("/"))
    }

    return <>
        <Paper sx={{ zIndex: 10, backgroundImage: "linear-gradient(#c2e7ff, white)", p: 3, width: "100%", position: "absolute", left: 0, top: 0 }} elevation={0}/>
        <Paper elevation={0} sx={{ zIndex: 11, position: "absolute", top: 7, left: 0, width: "100%", p: 2, backgroundColor: grey[50], borderRadius: 4 }}>
            <Stack direction="row" alignItems="center">
                <IconButton aria-label="back" sx={{ mr: 2 }} onClick={navigateBack}>
                    <ArrowBack/>
                </IconButton>
                <Typography variant="h5">{name}</Typography>
            </Stack>
        </Paper>
        <Paper elevation={0} sx={{ p: 5 }}/>
    </>
}
