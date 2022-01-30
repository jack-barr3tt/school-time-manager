import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';

export default function SetTimes() {
    const navigate = useNavigate()

    return <>
        <NavBar name="Set Lesson Times"/>
        <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} onClick={() => navigate("new")}>
            <Add/>
        </Fab>
    </>
}
