import React, { FC } from 'react';
import { IconButton, Paper, Stack, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

export const NavBar : FC<{ name: string }> = ({ name }) => {
    const navigate = useNavigate()

    return <>
        <Paper sx={{ backgroundImage: "linear-gradient(#c2e7ff, white)", p: 3, width: "100%", position: "absolute", left: 0, top: 0 }} elevation={0}/>
        <Paper elevation={0} sx={{ position: "absolute", top: 7, left: 0, width: "100%", p: 2, backgroundColor: grey[100], borderRadius: 4 }}>
            <Stack direction="row" alignItems="center">
                <IconButton aria-label="back" sx={{ mr: 2 }} onClick={() => navigate(-1)}>
                    <ArrowBack/>
                </IconButton>
                <Typography variant="h5">{name}</Typography>
            </Stack>
        </Paper>
        <Paper elevation={0} sx={{ p: 5 }}/>
    </>
}
