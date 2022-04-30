import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import Lesson from "../API/Lesson";
import { User } from "../API/Users";
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

    // Get lessons and lessonBlocks on mount
    useEffect(() => {
        fetchLessons()
    }, [fetchLessons])

    const value = {
        all: lessons,
        refresh: () => {
            fetchLessons()
        }
    }

    // All components that use this context will have access to its value
    return <TimetableContext.Provider value={value}>
        {children}
    </TimetableContext.Provider>
}