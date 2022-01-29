import { Add } from '@mui/icons-material';
import { Fab, Stack } from '@mui/material';
import React, { useState } from 'react';
import { HomeworkCard } from '../components/HomeworkCard';
import { NavBar } from '../components/NavBar';
import { Homework as HomeworkType } from '../types';

export default function Homework() {
    const [homework, setHomework] = useState<HomeworkType[]>([])

    return <>
        <NavBar name="Homework"/>         
        <Stack direction="column" spacing={3} alignItems="center">
            {homework.map(hw => <HomeworkCard key={hw.task} homework={hw} />)}
        </Stack>
        <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }}>
            <Add/>
        </Fab>
    </>
}