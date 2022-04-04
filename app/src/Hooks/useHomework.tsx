import { compareAsc } from "date-fns";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import Homework from "../API/Homework";
import { User } from "../API/Users";
import { MergeSort } from "../functions";
import { useUser } from "./useUser";

type HomeworkContextValue = {
    all: Homework[];
    next: Homework;
    refresh: () => void;
}

const HomeworkContext = createContext<Partial<HomeworkContextValue>>({})

export const useHomework = () => useContext(HomeworkContext) as HomeworkContextValue

export function HomeworkProvider (props: { children: ReactNode }) {
    const { children } = props

    const [homeworks, setHomeworks] = useState<Homework[]>()
    const [nextHomework, setNextHomework] = useState<Homework>()

    const { userId } = useUser()

    const fetchHomeworks = useCallback(async () => {
        const tempHomeworks = await User.forge(userId).homework?.get()
        setHomeworks(tempHomeworks)
        if(tempHomeworks)
            setNextHomework(
                MergeSort(
                    tempHomeworks, 
                    (a, b) => compareAsc(a.due || 0, b.due || 0)
                ).find(h => !h.complete)
            )
    }, [userId])

    useEffect(() => {
        fetchHomeworks()
    }, [fetchHomeworks])

    const value = {
        homeworks,
        next: nextHomework,
        refresh: () => fetchHomeworks()
    }

    return <HomeworkContext.Provider value={value}>
        {children}
    </HomeworkContext.Provider>
}