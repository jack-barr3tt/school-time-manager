import { Skeleton, Typography } from '@mui/material';
import { differenceInHours } from 'date-fns';
import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lesson from '../../API/Lesson';
import LessonBlock from '../../API/LessonBlock';
import Repeat from '../../API/Repeat';
import { User } from '../../API/Users';
import WorkingTime from '../../API/WorkingTimes';
import NavBar from '../../Components/NavBar';
import SettingsButton from '../../Components/SettingsButton';
import { useUser } from '../../Hooks/useUser';

export default function Setup() {
    const [weeks, setWeeks] = useState<Lesson[][][]>();
    const [repeats, setRepeats] = useState<Repeat[]>()
    const [lessonBlocks, setLessonBlocks] = useState<LessonBlock[]>()
    const [workingTimes, setWorkingTimes] = useState<WorkingTime[]>()
    const [notification, setNotification] = useState<number>()
    
    const { userId } = useUser()
    const navigate = useNavigate()

    const fetchData = useCallback(async () => {
        // Fetch the user, their repeats, their working times and their lesson blocks in parallel
        const [tempRepeats, tempTimes, tempBlocks, tempWeeks, fetchedUser] = await Promise.all([
            User.forge(userId).repeats?.get(),
            User.forge(userId).workingTimes?.get(),
            User.forge(userId).lessonBlocks?.get(),
            User.forge(userId).lessons?.getWeeks(),
            User.get(userId)
        ])
        setRepeats(tempRepeats)
        setWorkingTimes(tempTimes)
        setLessonBlocks(tempBlocks)
        setWeeks(tempWeeks?.lessons)
        setNotification(fetchedUser.prewarning || -1)
    }, [userId])

    // Fetch data on mount
    useEffect(() => {
        fetchData()
    }, [fetchData])

    const skeletonFiller = <SettingsButton mainText="Loading" lowerText="Loading"/>

    return <>
        <NavBar name="Setup"/>
        
        <Typography variant="h6">Timetable</Typography>

        { repeats && weeks ? 
            <SettingsButton 
                mainText="Repeats" 
                lowerText={`${weeks.reduce((a, b) => a + b.length, 0)} timetables, repeats every ${weeks.length} weeks`} 
                onClick={() => navigate("repeats")}
            /> 
        : 
            // Show a loading skeleton while repeats have not loaded
            <Skeleton variant="rectangular" width="100%" height="82px" animation="wave">{skeletonFiller}</Skeleton> 
        }

        { lessonBlocks ? 
            <SettingsButton 
                mainText="Lesson Times" 
                lowerText={`${lessonBlocks.length} lessons per day`}
                onClick={() => navigate("times")}
            /> 
        : 
            // Show a loading skeleton while lesson blocks have not loaded
            <Skeleton variant="rectangular" width="100%" height="82px" animation="wave">{skeletonFiller}</Skeleton> 
        }

        { workingTimes ? 
            <SettingsButton 
                mainText="Working Times" 
                lowerText={workingTimes.map(t => differenceInHours(t.end_time, t.start_time)).reduce((a,b) => a + b, 0).toFixed() + " hours per day"}
                onClick={() => navigate("workingtimes")}
            /> 
        : 
            // Show a loading skeleton while working times have not loaded
            <Skeleton variant="rectangular" width="100%" height="82px" animation="wave">{skeletonFiller}</Skeleton> 
        }
        
        <Typography variant="h6">Notifications</Typography>

        { notification ? 
            <SettingsButton 
                mainText="Pre-warning" 
                lowerText={notification === -1 ? "Not set" : `${notification} minutes before`} 
                onClick={() => navigate("prewarning")}
            /> 
        : 
            // Show a loading skeleton while notification prewarning has not loaded
            <Skeleton variant="rectangular" width="100%" height="82px" animation="wave">{skeletonFiller}</Skeleton> 
        }
    </>
}
