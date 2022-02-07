import { Save } from '@mui/icons-material';
import { TimePicker } from '@mui/lab';
import { Fab, Stack, TextField } from '@mui/material';
import React, { FormEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../api/Users';
import { userContext } from '../../App';
import { NavBar } from '../../components/NavBar';

export default function NewWorkingTime() {
    const [startTime, setStartTime] = useState<Date|null>()
    const [endTime, setEndTime] = useState<Date|null>()

    const user = useContext(userContext)
    const navigate = useNavigate()

    const saveWorkingTime = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(startTime && endTime) {
            try{
                await User.forge(user.id).workingTimes?.create({
                    start_time: startTime.getTime(),
                    end_time: endTime.getTime()
                })
                navigate('/setup/workingtimes')
            }catch{}
        }
    }

    return <>
        <NavBar name="New Working Time"/>
        <form onSubmit={saveWorkingTime}>
            <Stack direction="column" spacing={2}>
                <TimePicker
                    label="Start"
                    renderInput={(params) => <TextField {...params} />}
                    onChange={(e) => setStartTime(e)}
                    value={startTime}
                />
                <TimePicker
                    label="End"
                    renderInput={(params) => <TextField {...params} />}
                    onChange={(e) => setEndTime(e)}
                    value={endTime}
                    minTime={startTime}
                    disabled={startTime == null}
                />
                <Fab 
                    color="primary" 
                    sx={{ position: "absolute", right: "24px", bottom: "24px" }} 
                    type="submit" 
                    disabled={startTime == null || endTime == null}
                >
                    <Save/>
                </Fab>
            </Stack>
        </form>
    </>;
}
