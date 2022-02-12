import { Stack, TextField } from '@mui/material';
import { addHours } from 'date-fns';
import { FormEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../API/Users';
import { userContext } from '../../../App';
import NavBar from '../../../Components/NavBar';
import TimeRangePicker, { OptionalDate } from '../../../Components/TimeRangePicker';

export default function NewBlock() {
    const defaultEnd = addHours(new Date(), 1)
    const [name, setName] = useState("")
    const [start, setStart] = useState<OptionalDate>(new Date())
    const [end, setEnd] = useState<OptionalDate>(defaultEnd)

    const user = useContext(userContext)

    const navigate = useNavigate()

    const saveTime = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(name && start && end && user) {
            await User.forge(user.id).lessonBlocks?.create({
                name,
                start_time: start.getTime(),
                end_time: end.getTime()
            })
            navigate("/setup/times")
        }   
    }

    return <>
        <NavBar name="New Lesson"/>
        <form onSubmit={saveTime}>
            <Stack direction="column" spacing={2}>
                <TextField
                    label="Name"
                    fullWidth
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value) }
                />
                <TimeRangePicker
                    startTime={start}
                    setStartTime={setStart}
                    endTime={end}
                    setEndTime={setEnd}
                    autoDifference={{ hours: 1 }}
                />
            </Stack>
        </form>
    </>
}