import { Add, Delete, Edit } from '@mui/icons-material';
import { ButtonGroup, Fab, IconButton, Paper, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { FormEvent, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../API/Users';
import WorkingTime from '../../../API/WorkingTimes';
import { userContext } from '../../../App';
import NavBar from '../../../Components/NavBar';
import TimeRangePicker from '../../../Components/TimeRangePicker';

export default function SetWorkingTimes() {
    const navigate = useNavigate()

    const [times, setTimes] = useState<WorkingTime[]>()
    const [showDialog, setShowDialog] = useState(false)

    const [newStartTime, setNewStartTime] = useState<Date|null>()
    const [newEndTime, setNewEndTime] = useState<Date|null>()

    const user = useContext(userContext)

    const fetchWorkingTimes = useCallback(async () => {
        const times = await User.forge(user.id).workingTimes?.get()
        setTimes(times)
        console.log(times)
    }, [user.id])

    const editTime = async (id: number) => {
        console.log(id)
        setShowDialog(true)
    }

    const updateWorkingTime = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    const deleteTime = async (id: number) => {
        if(times) {
            let time = times.find(t => t._id === id)
            if(time) {
                await time.delete()
                setTimes(
                    times.filter(t => t._id !== id)
                )
            }
        }
    }

    useEffect(() => {
        fetchWorkingTimes()
    }, [fetchWorkingTimes])
    
    return <>
        <NavBar name="Set Working Times"/>
        { showDialog ? <TimeRangePicker 
            startTime={newStartTime}
            setStartTime={setNewStartTime}
            endTime={newEndTime}
            setEndTime={setNewEndTime}
            onSubmit={updateWorkingTime}
        />
        : <>
            <Stack>
                {
                    times && times.map(t => <Paper key={t._id}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%", p: 2 }}>
                            <Typography variant="subtitle1">{`${format(t.start_time, "kk:mm")} to ${format(t.end_time, "kk:mm")}`}</Typography>
                            <ButtonGroup>
                                <IconButton onClick={(_e) => editTime(t._id)} id={""+t._id}>
                                    <Edit/>
                                </IconButton>
                                <IconButton onClick={(_e) => deleteTime(t._id)} id={""+t._id}>
                                    <Delete/>
                                </IconButton>
                            </ButtonGroup>
                        </Stack>
                    </Paper>)
                }
            </Stack>
            <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} onClick={() => navigate("new")}>
                <Add/>
            </Fab>
        </> }
    </>;
}
