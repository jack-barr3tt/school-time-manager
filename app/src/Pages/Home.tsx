import { Settings } from '@mui/icons-material';
import { ButtonBase, Paper, Stack, Typography, useTheme } from '@mui/material';
import { red } from '@mui/material/colors';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../API/Users';
import { Card } from '../Components/Card';
import { DateToMonth } from '../functions';
import { useHomework } from '../Hooks/useHomework';
import { useTimetable } from '../Hooks/useTimetable';
import { useUser } from '../Hooks/useUser';

export default function Home() {
    const [user, setUser] = useState<User>();

    const navigate = useNavigate()
    const theme = useTheme()

    const { next: nextHomework }= useHomework()
    const { next: nextLesson } = useTimetable()

    const { userId } = useUser()

    const fetchUser = useCallback(async () => {
        if(userId && !user) setUser(
            await User.get(userId)
        )
    }, [userId, user])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    return <>
        <Paper sx={{ backgroundImage: `linear-gradient(${theme.palette.secondary.main}, ${theme.palette.background.default})`, p: 3, width: 1, position: "absolute", left: 0, top: 0 }} elevation={0}/>
        <Typography variant="h5" textAlign="center" sx={{ zIndex: 1, py: 1 }}>{ user && user.username ? `Welcome, ${user.username}` : "Welcome"}</Typography>
        <Stack direction="column" alignItems="center" spacing={2}>
            <Card
                mainText="Homework"
                calendarProps={ nextHomework && nextHomework.due && {
                    topText: DateToMonth(nextHomework.due),
                    bottomText: [""+nextHomework.due.getDate()],
                    accentColor: red[500]
                }}
                onClick={() => navigate("homework")}
            />

            <Card
                mainText="Timetable"
                calendarProps={ nextLesson && {
                    topText: nextLesson.subject.name,
                    bottomText: [
                        format(nextLesson.block.start_time, "kk:mm"),
                        "TO",
                        format(nextLesson.block.end_time, "kk:mm")
                    ],
                    accentColor: nextLesson.subject.color
                }}
                onClick={() => navigate("timetable")}
            />

            <ButtonBase 
                sx={{
                    borderRadius: 3 
                }}
                onClick={() => navigate("setup")}
            >
                <Paper sx={{ py: 1, px: 3, borderRadius: 3 }} elevation={3}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Settings/>
                        <Typography variant="h5">Setup</Typography>
                    </Stack>
                </Paper>
            </ButtonBase>
        </Stack>
    </>
}


