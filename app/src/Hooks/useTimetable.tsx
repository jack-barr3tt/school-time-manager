import { compareAsc, isFuture } from "date-fns";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import Lesson from "../API/Lesson";
import LessonBlock from "../API/LessonBlock";
import { User } from "../API/Users";
import { MergeSort, TransposeLessonBlock } from "../functions";
import { useUser } from "./useUser";
import { useWeek } from "./useWeek";

type TimetableContextValue = {
    all: Lesson[]
    next: Lesson
    refresh: () => void
}

const TimetableContext = createContext<Partial<TimetableContextValue>>({})

export const useTimetable = () => useContext(TimetableContext) as TimetableContextValue

export function TimetableProvider (props: { children: ReactNode }) {
    const { children } = props

    const [lessons, setLessons] = useState<Lesson[]>()
    const [nextLesson, setNextLesson] = useState<Lesson>()
    const [lessonBlocks, setLessonBlocks] = useState<LessonBlock[]>()
    
    const { week } = useWeek()
    const { userId } = useUser()

    const fetchLessons = useCallback(async () => {
        if(week) {
            const tempLessons = await User.forge(userId).lessons?.get()
            const tempLessonsThisWeek = tempLessons?.filter(l => week.some(r => r._id === l.repeat._id))
            // Only store lessons that are in the current week
            setLessons(tempLessonsThisWeek)
        }
    }, [userId, week])

    const fetchBlocks = useCallback(async () => {
        setLessonBlocks(await User.forge(userId).lessonBlocks?.get())
    }, [userId])

    const getNextLesson = useCallback(async () => {
        if(lessonBlocks && lessons) {
            // Get all lessons happening today
            const lessonsToday = lessons?.filter(l => l.day === new Date().getDay() - 1)
            // Get all lesson blocks occuring today
            const lessonBlocksToday = lessonBlocks.map(b => TransposeLessonBlock(b))
            // Get all remaining lesson blocks and sort them from soonest to latest
            const lessonBlocksLeft = MergeSort(
                lessonBlocksToday.filter(b => isFuture(b.start_time)),
                (a,b) => compareAsc(a.start_time, b.start_time)
            )
            // The next lesson will be the one whose block id matches the id of the first item in lessonBlocksLeft
            setNextLesson(
                lessonsToday?.find(l => lessonBlocksLeft.some(b => b._id === l.block._id))
            )
        }
    }, [lessonBlocks, lessons])

    // Get next lesson whenever lessons or lessonBlocks change
    useEffect(() => {
        getNextLesson()
    }, [getNextLesson, lessons, lessonBlocks])

    // Get lessons and lessonBlocks on mount
    useEffect(() => {
        fetchLessons()
        fetchBlocks()
    }, [fetchLessons, fetchBlocks])

    const value = {
        all: lessons,
        next: nextLesson,
        refresh: () => {
            fetchLessons()
            fetchBlocks()
        }
    }

    // All components that use this context will have access to its value
    return <TimetableContext.Provider value={value}>
        {children}
    </TimetableContext.Provider>
}