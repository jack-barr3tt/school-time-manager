import { Stack } from '@mui/material';
import { add } from 'date-fns';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../API/Users';
import NavBar from '../../../Components/NavBar';
import TimeRangePicker, { OptionalDate } from '../../../Components/TimeRangePicker';
import { useUser } from '../../../Hooks/useUser';

export default function NewWorkingTime() {
    const [startTime, setStartTime] = useState<OptionalDate>(new Date())
    const [endTime, setEndTime] = useState<OptionalDate>(add(new Date(), { hours: 2 }))

    const { userId } = useUser()
    const navigate = useNavigate()

    const saveWorkingTime = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(startTime && endTime) {
            try{
                await User.forge(userId).workingTimes?.create({
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
                <TimeRangePicker
                    startTime={startTime}
                    setStartTime={setStartTime}
                    endTime={endTime}
                    setEndTime={setEndTime}
                    autoDifference={{ hours: 2 }}
                />
            </Stack>
        </form>
    </>;
}
