import { Stack } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeworkCard } from '../components/HomeworkCard';
import { Homework as HomeworkType } from '../types';

export default function Homework() {
    const [homework, setHomework] = useState<HomeworkType[]>([])

    return <div>
        <h2>Homework</h2>
        <Stack direction="column" spacing={3} alignItems="center">
            {homework.map(hw => <HomeworkCard key={hw.task} homework={hw} />)}
        </Stack>
        <Link to="new">Add homework task</Link>
    </div>
}