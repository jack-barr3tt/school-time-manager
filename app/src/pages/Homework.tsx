import { Add } from '@mui/icons-material';
import { Fab, Stack } from '@mui/material';
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
    
    useEffect(() => {
        User.forge(user.id).homework?.get().then(h => {
            setHomework(h)
        })
    }, [user.id])

    return <>
        <NavBar name="Homework"/>         
        <Stack direction="column" spacing={3} alignItems="center">
            {homework.sort((a,b) => a.due.getTime() - b.due.getTime()).map(hw => <HomeworkCard key={hw.task} homework={hw} />)}
        </Stack>
        <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} onClick={() => navigate("new")}>
            <Add/>
        </Fab>
    </>
}