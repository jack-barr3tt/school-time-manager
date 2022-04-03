import { compareAsc } from "date-fns";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import Homework from "../API/Homework";
import { User } from "../API/Users";
import { userContext } from "../App";
import { MergeSort } from "../functions";

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

    const user = useContext(userContext)

    const fetchHomeworks = useCallback(async () => {
        const tempHomeworks = await User.forge(user.id).homework?.get()
        setHomeworks(tempHomeworks)
        if(tempHomeworks)
            setNextHomework(
                MergeSort(
                    tempHomeworks, 
                    (a, b) => compareAsc(a.due || 0, b.due || 0)
                ).find(h => !h.complete)
            )
    }, [user])

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