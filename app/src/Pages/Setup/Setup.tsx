import { Skeleton, Typography } from '@mui/material';
import { differenceInHours } from 'date-fns';
import { useContext, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonBlock from '../../API/LessonBlock';
import { User } from '../../API/Users';
import WorkingTime from '../../API/WorkingTimes';
import { userContext } from '../../App';
import NavBar from '../../Components/NavBar';
import SettingsButton from '../../Components/SettingsButton';

export default function Setup() {
    const navigate = useNavigate()

    const user = useContext(userContext)

    // const [schoolDays, setSchoolDays] = useState()
    const [lessonBlocks, setLessonBlocks] = useState<LessonBlock[]>()
    const [workingTimes, setWorkingTimes] = useState<WorkingTime[]>()
    // const [notification, setNotification] = useState()

    const fetchData = useCallback(async () => {
        const [tempTimes, tempBlocks] = await Promise.all([
            await User.forge(user.id).workingTimes?.get(),
            await User.forge(user.id).lessonBlocks?.get()
        ])
        setWorkingTimes(tempTimes)
        setLessonBlocks(tempBlocks)
    }, [user.id])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const skeletonFiller = <SettingsButton mainText="Loading" lowerText="Loading"/>

    return <>
        <NavBar name="Setup"/>
        
        <Typography variant="h6">Timetable</Typography>
        <SettingsButton 
            mainText="School Days" 
            lowerText="5 days perk week" 
            onClick={() => navigate("days")}
        />

        { lessonBlocks ? <SettingsButton 
            mainText="Lesson Times" 
            lowerText={`${lessonBlocks.length} lessons per day`}
            onClick={() => navigate("times")}
        /> : <Skeleton variant="rectangular" width="100%" height="82px" animation="wave">{skeletonFiller}</Skeleton> }

        { workingTimes ? <SettingsButton 
            mainText="Working Times" 
            lowerText={workingTimes.map(t => differenceInHours(t.end_time, t.start_time)).reduce((a,b) => a + b, 0).toFixed() + " hours per day"}
            onClick={() => navigate("workingtimes")}
        /> : <Skeleton variant="rectangular" width="100%" height="82px" animation="wave">{skeletonFiller}</Skeleton> }
        
        <Typography variant="h6">Notifications</Typography>

        <SettingsButton 
            mainText="Pre-warning" 
            lowerText="10 minutes before" 
            onClick={() => navigate("prewarning")}
        />
    </>
}
