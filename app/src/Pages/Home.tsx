import { Logout, Settings } from '@mui/icons-material';
import { Paper, Typography, useTheme } from '@mui/material';
import { red } from '@mui/material/colors';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Homework from '../API/Homework';
import Lesson from '../API/Lesson';
import { User } from '../API/Users';
import { Card } from '../Components/Card';
import SimpleButton from '../Components/SimpleButton';
import { DateToMonth } from '../functions';
import { useUser } from '../Hooks/useUser';

export default function Home() {
    const [user, setUser] = useState<User>()

    const navigate = useNavigate()
    const theme = useTheme()

    const [nextLesson, setNextLesson] = useState<Lesson>()
    const [nextHomework, setNextHomework] = useState<Homework>()

    const { userId, logout } = useUser()

    const fetchData = useCallback(async () => {
        if(userId) {
            const [tempUser, tempLesson, tempHomework] = await Promise.all([
                User.get(userId),
                User.forge(userId).lessons?.getNext(),
                User.forge(userId).homework?.getNext()
            ])
            if(!tempUser) setUser(tempUser)
            setNextLesson(tempLesson)
            setNextHomework(tempHomework)
        }
    }, [userId, user])

    // Fetch user on mount
    useEffect(() => {
        fetchData()
    }, [fetchData])

    return <>
        <Paper 
            sx={{ 
                backgroundImage: `linear-gradient(${theme.palette.secondary.main}, ${theme.palette.background.default})`, 
                p: 3, 
                width: 1, 
                position: "absolute", 
                left: 0, 
                top: 0 
            }} 
            elevation={0}
        />
        
        <Typography variant="h5" textAlign="center" sx={{ zIndex: 1, py: 1 }}>{ user && user.username ? `Welcome, ${user.username}` : "Welcome"}</Typography>
        
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

        <SimpleButton
            onClick={() =>  navigate("/setup")}
            text="Setup"
            icon={<Settings/>}
        />

        <SimpleButton
            onClick={logout}
            text="Logout"
            icon={<Logout/>}
        />
    </>
}


