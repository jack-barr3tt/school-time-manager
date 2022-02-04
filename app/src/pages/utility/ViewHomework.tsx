import { AccessTime, Assignment, Circle, Event } from '@mui/icons-material';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { addDays, format, formatDistanceToNow, isAfter, startOfDay } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Homework from '../../api/Homework';
import { User } from '../../api/Users';
import { userContext } from '../../App';
import { NavBar } from '../../components/NavBar';

export default function ViewHomework() {
    const [homework, setHomework] = useState<Homework>()
    const [loading, setLoading] = useState<boolean>(true)
    const { id } = useParams()
    const user = useContext(userContext)
    const navigate = useNavigate()

    useEffect(() => {
        User.forge(user.id).homework?.get(parseInt(id || "0")).then(h => {
            setHomework(h as Homework)
            setLoading(false)
        }).catch(() => 
            navigate("/homework")
        )
    }, [user.id, id])

    const getColor = (color?: number) => {
        if(!color) return grey[500];
        let base = color.toString(16);
        if(base.length < 6) {
            const fill = new Array(6 - base.length).fill("0").join("");
            base = fill + base;
        }
        return base; 
    }

    const getDueColor = (due: Date) => {
        if(isAfter(addDays(Date.now(), 1),startOfDay(due))) {
            console.log("due tomorrow")
            return { color: "error.main" }
        }
        return {}
    }

    return <>
        <NavBar name="View Homework"/>
        { loading && <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                <CircularProgress/>
            </Stack>
        }

        { homework?.task && <>
            <Stack direction="row" spacing={3} alignItems="center" sx={{ pt: 2 }}>
                <Assignment/>
                <Typography variant="h5">Task</Typography>
            </Stack>
            <Typography variant="body1">{homework.task}</Typography>
        </> }

        { homework?.subject?.name && <>
            <Stack direction="row" spacing={3} alignItems="center" sx={{ pt: 2 }}>
                <Circle sx={{ color: `#${getColor(homework?.subject?.color)}`, mr: 1 }} />
                <Typography variant="h5">Subject</Typography>
            </Stack>
            <Typography variant="body1">{homework?.subject?.name}</Typography>
        </> }

        { homework?.due != null && <>
            <Stack direction="row" spacing={3} alignItems="center" sx={{ pt: 2 }}>
                <Event sx={getDueColor(homework?.due)}/>
                <Typography variant="h5" sx={getDueColor(homework?.due)}>Due</Typography>
            </Stack>
            <Typography variant="body1" sx={getDueColor(homework?.due)}>{`${format(homework?.due, "dd/MM/yy")} (${formatDistanceToNow(homework?.due)})`}</Typography>
        </> }

        { homework?.difficulty && <>
            <Stack direction="row" spacing={3} alignItems="center" sx={{ pt: 2 }}>
                <AccessTime/>
                <Typography variant="h5">Difficulty</Typography>
            </Stack>
            <Typography variant="body1">{["Easy","Medium","Hard"][homework?.difficulty || 0]}</Typography>
        </> }
    </>;
}
