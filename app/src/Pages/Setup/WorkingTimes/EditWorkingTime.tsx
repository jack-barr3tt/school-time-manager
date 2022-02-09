import { FormEvent, useCallback, useContext, useEffect, useState } from 'react';
import { User } from '../../../API/Users';
import WorkingTime from '../../../API/WorkingTimes';
import { userContext } from '../../../App';
import NavBar from '../../../Components/NavBar';
import TimeRangePicker from '../../../Components/TimeRangePicker';

export default function EditWorkingTime(props: { back: () => void, id?: number }) {
    const { back, id } = props
    const [newStartTime, setNewStartTime] = useState<Date|null>()
    const [newEndTime, setNewEndTime] = useState<Date|null>()
    const [time, setTime] = useState<WorkingTime>()

    const user = useContext(userContext)

    const fetchTime = useCallback(async () => {
        if(id)
            setTime(
                await User.forge(user.id)?.workingTimes?.get(id)
            )
    }, [id, user.id])

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
            }catch(err){
                console.log(err)
            }
        }
    }

    return <>
        <NavBar name="Edit Working Time" onBack={back}/>
        <form onSubmit={saveWorkingTime}>
            <TimeRangePicker
                startTime={newStartTime}
                setStartTime={setNewStartTime}
                endTime={newEndTime}
                setEndTime={setNewEndTime}
            />
        </form>
    </>
}
