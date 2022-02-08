import { FormEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../API/Users';
import { userContext } from '../../../App';
import NavBar from '../../../Components/NavBar';
import TimeRangePicker from '../../../Components/TimeRangePicker';

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
        <TimeRangePicker
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            onSubmit={saveWorkingTime}
        />
    </>;
}
