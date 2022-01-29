import { AccessTime, Circle } from '@mui/icons-material';
import { Paper, Stack, Typography } from '@mui/material';
import { grey, red } from '@mui/material/colors';
import React, { FC } from 'react';
import { Homework } from '../types';

export const HomeworkCard : FC<{ homework: Homework }> = ({ homework }) => {
    const { id, task, subject, due, difficulty } = homework;
    const { name, color } = subject;

    const getMonth = (date: Date) => {
        const months = [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC"
        ]

        return months[date.getMonth()]
    }
    
    const getDifficulty = (difficulty: number) => {
        return ["Easy", "Medium", "Hard"][difficulty];
    }

    const getColor = (color: number) => {
        let base = color.toString(16);
        if(base.length < 6) {
            const fill = new Array(6 - base.length).fill("0").join("");
            base = fill + base;
        }
        return base; 
    }

    return <Paper elevation={4} sx={{ p: 2, borderRadius: 6, width: "361px" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="column">
                <Typography variant="h5" sx={{ my: 2 }}>{task}</Typography>
                <Stack direction="row" alignItems="center">
                    <Circle sx={{ color: `#${getColor(color)}`, mr: 1 }} />
                    <Typography variant="body1">{subject.name}</Typography>
                    { difficulty != null && <>
                        <AccessTime sx={{ ml: 3, mr: 1 }}/>
                        <Typography variant="body1">{getDifficulty(difficulty)}</Typography>
                    </>}
                </Stack>
            </Stack>
            {due && <Paper elevation={0} sx={{ width: "96px", height: "96px", backgroundColor: grey[200], borderRadius: 3 }}>
                <Paper sx={{ width: "100%", height: "24px", borderRadius: "12px 12px 0 0", backgroundColor: red[500] }} elevation={0}>
                    <Typography variant="body1" sx={{ textAlign: "center", height: "100%" }} color="white">{getMonth(due)}</Typography>
                </Paper>
                <Typography variant="body1" sx={{ textAlign: "center", fontSize: "2.5rem", my: "6px" }}>{due.getDate()}</Typography>
            </Paper>}
        </Stack>
    </Paper>
}