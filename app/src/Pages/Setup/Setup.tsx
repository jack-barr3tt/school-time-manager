import { Skeleton, Typography } from '@mui/material';
import { differenceInHours } from 'date-fns';
import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonBlock from '../../API/LessonBlock';
import Repeat from '../../API/Repeat';
import { User } from '../../API/Users';
import WorkingTime from '../../API/WorkingTimes';
import NavBar from '../../Components/NavBar';
import SettingsButton from '../../Components/SettingsButton';
import { useUser } from '../../Hooks/useUser';
import { useWeek } from '../../Hooks/useWeek';

export default function Setup() {
    const [repeats, setRepeats] = useState<Repeat[]>()
    const [lessonBlocks, setLessonBlocks] = useState<LessonBlock[]>()
    const [workingTimes, setWorkingTimes] = useState<WorkingTime[]>()
    const [notification, setNotification] = useState<number>()
    
    const { userId } = useUser()
    const navigate = useNavigate()

    const fetchData = useCallback(async () => {
        const [tempRepeats, tempTimes, tempBlocks, fetchedUser] = await Promise.all([
            User.forge(userId).repeats?.get(),
            User.forge(userId).workingTimes?.get(),
            User.forge(userId).lessonBlocks?.get(),
            User.get(userId)
        ])
        setRepeats(tempRepeats)
        setWorkingTimes(tempTimes)
        setLessonBlocks(tempBlocks)
        setNotification(fetchedUser.prewarning || -1)
    }, [userId])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const { weeks } = useWeek()

    const skeletonFiller = <SettingsButton mainText="Loading" lowerText="Loading"/>

    return <>
        <NavBar name="Setup"/>
        
        <Typography variant="h6">Timetable</Typography>
        { repeats ? <SettingsButton 
            mainText="Repeats" 
            lowerText={`${weeks.reduce((a, b) => a + b.length, 0)} timetables, repeats every ${weeks.length} weeks`} 
            onClick={() => navigate("repeats")}
        /> : <Skeleton variant="rectangular" width="100%" height="82px" animation="wave">{skeletonFiller}</Skeleton> }

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

        { notification ? <SettingsButton 
            mainText="Pre-warning" 
            lowerText={notification === -1 ? "Not set" : `${notification} minutes before`} 
            onClick={() => navigate("prewarning")}
        /> : <Skeleton variant="rectangular" width="100%" height="82px" animation="wave">{skeletonFiller}</Skeleton> }
    </>
}
