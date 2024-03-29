import { AccessTime, Assignment, Check, Circle, Delete, Edit, Event } from '@mui/icons-material';
import { Button, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { addDays, format, formatDistanceToNow, isAfter, startOfDay } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Homework from '../../API/Homework';
import { User } from '../../API/Users';
import NavBar from '../../Components/NavBar';
import { ColorIntToString, MinutesToHrsMins } from '../../functions';
import { useUser } from '../../Hooks/useUser';
import EditHomework from './EditHomework';

export default function ViewHomework() {
    const [homework, setHomework] = useState<Homework>()
    const [loading, setLoading] = useState<boolean>(true)
    const [editing, setEditing] = useState<boolean>(false)
    const [editingId, setEditingId] = useState<number>()
    
    const { id } = useParams()
    const navigate = useNavigate()
    const { userId } = useUser()

    const fetchHomework = useCallback(async () => {
        if(id) {
            try{
                setHomework(
                    await User.forge(userId).homework?.get(parseInt(id || "0"))
                )
                setLoading(false)
            }catch(err){
                navigate("/homework")
            }
        }
    }, [userId, navigate, id])

    // Fetch the homework on mount and when edit mode is toggled
    useEffect(() => {
        fetchHomework()
    }, [fetchHomework, editing])

    // If homework is due tomorrow, the text should have the error color
    const getDueColor = (due: Date) => {
        if(isAfter(addDays(Date.now(), 1),startOfDay(due))) return { color: "error.main" }
        return {}
    }

    const deleteHomework = async () => {
        if(homework) {
            await homework.delete()
            navigate("/homework")
        }
    }

    return <>
        { !editing ? homework && <>
            <NavBar name="View Homework" controls={[
                <IconButton onClick={() => {
                    setEditing(true)
                    setEditingId(homework._id)
                }}>
                    <Edit/>
                </IconButton>,
                <IconButton onClick={deleteHomework}>
                    <Delete/>
                </IconButton>
            ]}/>
            { loading && <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: 1 }}>
                    <CircularProgress/>
                </Stack>
            }

            { homework.task && <>
                <Stack direction="row" spacing={3} alignItems="center" sx={{ pt: 2 }}>
                    <Assignment/>
                    <Typography variant="h5">Task</Typography>
                </Stack>
                <Typography>{homework.task}</Typography>
            </> }

            { homework.subject?.name && <>
                <Stack direction="row" spacing={3} alignItems="center" sx={{ pt: 2 }}>
                    <Circle sx={{ color: ColorIntToString(homework.subject?.color), mr: 1 }} />
                    <Typography variant="h5">Subject</Typography>
                </Stack>
                <Typography>{homework.subject?.name}</Typography>
            </> }

            { homework.due != null && <>
                <Stack direction="row" spacing={3} alignItems="center" sx={{ pt: 2 }}>
                    <Event sx={getDueColor(homework.due)}/>
                    <Typography variant="h5" sx={getDueColor(homework.due)}>Due</Typography>
                </Stack>
                <Typography sx={getDueColor(homework.due)}>{`${format(homework.due, "dd/MM/yy")} (${formatDistanceToNow(homework.due, { addSuffix: true })})`}</Typography>
            </> }

            { homework.duration && <>
                <Stack direction="row" spacing={3} alignItems="center" sx={{ pt: 2 }}>
                    <AccessTime/>
                    <Typography variant="h5">Duration</Typography>
                </Stack>
                <Typography>{MinutesToHrsMins(homework.duration)}</Typography>
            </> }

            <Button
                fullWidth
                variant="outlined"
                onClick={async () => {
                    if(homework) {
                        await homework.markComplete()
                        navigate("/homework")
                    }
                }}
            >
                <Check/>
                Complete
            </Button>
        </>
        :
        <EditHomework back={() => setEditing(false)} id={editingId}/>
    }</>
}
