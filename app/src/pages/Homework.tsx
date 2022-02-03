import { Add } from '@mui/icons-material';
import { CircularProgress, Fab, Stack } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Homework from '../api/Homework';
import { User } from '../api/Users';
import { userContext } from '../App';
import { HomeworkCard } from '../components/HomeworkCard';
import { NavBar } from '../components/NavBar';

export default function HomeworkPage() {
    const [homework, setHomework] = useState<Homework[]>([])
    const navigate = useNavigate()

    const user = useContext(userContext)

    const [loading, setLoading] = useState<boolean>(true)
    
    useEffect(() => {
        User.forge(user.id).homework?.get().then(h => {
            setHomework(h)
            setLoading(false)
        })
    }, [user.id])
    
    return <>
        <NavBar name="Homework"/>
        {loading && <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                <CircularProgress/>
            </Stack>
        } 
        <Stack direction="column" spacing={3} alignItems="center" sx={{ pt: 2 }}>
        </Stack>
        <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} onClick={() => navigate("new")}>
            <Add/>
        </Fab>
    </>
}