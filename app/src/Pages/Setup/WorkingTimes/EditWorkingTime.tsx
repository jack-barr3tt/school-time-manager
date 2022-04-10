import { Stack } from '@mui/material';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { User } from '../../../API/Users';
import WorkingTime from '../../../API/WorkingTimes';
import NavBar from '../../../Components/NavBar';
import TimeRangePicker, { OptionalDate } from '../../../Components/TimeRangePicker';
import { useUser } from '../../../Hooks/useUser';

export default function EditWorkingTime(props: { back: () => void, id?: number }) {
    const { back, id } = props
    const [newStartTime, setNewStartTime] = useState<OptionalDate>()
    const [newEndTime, setNewEndTime] = useState<OptionalDate>()
    const [time, setTime] = useState<WorkingTime>()

    const { userId } = useUser()

    const fetchTime = useCallback(async () => {
        if(id)
            setTime(
                await User.forge(userId)?.workingTimes?.get(id)
            )
    }, [id, userId])

    // Fetch working times on mount
    useEffect(() => {   
        fetchTime()
    }, [fetchTime])

    const saveWorkingTime = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(newStartTime && newEndTime) {
            try{
                await time?.edit({
                    start_time: newStartTime,
                    end_time: newEndTime
                })
                back()
            }catch{}
        }
    }

    return <>
        <NavBar name="Edit Working Time" onBack={back}/>
        <form onSubmit={saveWorkingTime}>
            <Stack direction="column" spacing={2}>
                <TimeRangePicker
                    startTime={newStartTime}
                    setStartTime={setNewStartTime}
                    endTime={newEndTime}
                    setEndTime={setNewEndTime}
                />
            </Stack>
        </form>
    </>
}
