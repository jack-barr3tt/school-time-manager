import { compareDesc } from "date-fns";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import Homework from "../API/Homework";
import { User } from "../API/Users";
import { MergeSort } from "../functions";
import { useUser } from "./useUser";

type HomeworkContextValue = {
    all: Homework[]
    next: Homework
    refresh: () => void
}

const HomeworkContext = createContext<Partial<HomeworkContextValue>>({})

export const useHomework = () => useContext(HomeworkContext) as HomeworkContextValue

export function HomeworkProvider (props: { children: ReactNode }) {
    const { children } = props

    const [homeworks, setHomeworks] = useState<Homework[]>()
    const [nextHomework, setNextHomework] = useState<Homework>()

    const { userId } = useUser()

    const fetchHomeworks = useCallback(async () => {
        // Fetch all homeworks
        const tempHomeworks = await User.forge(userId).homework?.get()
        setHomeworks(tempHomeworks)

        /*
        If we get homeworks, sort them by date and then pick the next incomplete one,
        as this will be the next homework to be completed.
        */
        if(tempHomeworks)
            setNextHomework(
                MergeSort(
                    tempHomeworks, 
                    (a, b) => compareDesc(a.due || 0, b.due || 0)
                ).find(h => !h.complete)
            )
    }, [userId])

    // Fetch all homeworks on mount
    useEffect(() => {
        fetchHomeworks()
    }, [fetchHomeworks])

    const value = {
        homeworks,
        next: nextHomework,
        refresh: () => fetchHomeworks()
    }

    // All components that use this context will have access to its value
    return <HomeworkContext.Provider value={value}>
        {children}
    </HomeworkContext.Provider>
}