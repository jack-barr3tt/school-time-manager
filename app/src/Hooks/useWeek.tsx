import { differenceInWeeks } from "date-fns";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import Repeat from "../API/Repeat";
import { User } from "../API/Users";
import { RepeatsToWeeks } from "../functions";
import { useUser } from "./useUser";

type WeekContextValue = {
    week: Repeat[],
    weeks: Repeat[][],
    weekNo: number,
    changeWeek: (index?: number) => void
}

const WeekContext = createContext<Partial<WeekContextValue>>({})

export const useWeek = () => {
    return useContext(WeekContext) as WeekContextValue
}

export function WeekProvider (props: { children: ReactNode }) {
    const { children } = props

    const [APIUser, setAPIUser] = useState<User>()
    const [week, setWeek] = useState<Repeat[]>()
    const [weekNo, setWeekNo] = useState<number>()
    const [repeats, setRepeats] = useState<Repeat[]>()
    const [weeks, setWeeks] = useState<Repeat[][]>([])

    const { userId } = useUser()

    const fetchData = useCallback(async () => {
        // Fetch the user and their repeats in parallel
        const [tempUser, tempRepeats] = await Promise.all([
            User.get(userId),
            User.forge(userId).repeats?.get()
        ])
        setAPIUser(tempUser)
        setRepeats(tempRepeats)
    }, [userId])

    // Fetch data on mount
    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Update the weeks array when the repeats change
    useEffect(() => {
        if(repeats) setWeeks(RepeatsToWeeks(repeats))
    }, [repeats])

    const changeWeek = async (index?: number) => {
        if(weeks && APIUser && index != null) {
            const pickedWeek = weeks[index]
            await APIUser.setRepeat(pickedWeek[0]._id)
            setWeek(pickedWeek)
            fetchData()
        }
    }

    const getCurrentWeek = useCallback(() => {
        if(APIUser) {
            const repeatId = APIUser.repeat?._id
            if(APIUser.repeat_ref && repeatId && weeks) {
                const weeksSinceRef = differenceInWeeks(new Date(), APIUser.repeat_ref)
                if(weeksSinceRef === 0) {
                    for(let i = 0; i < weeks.length; i++) {
                        if(weeks[i].some(r => r._id === repeatId)) {
                            setWeekNo(i)
                            setWeek(weeks[i])
                            return
                        }
                    }
                }else{
                    return weeks[weeksSinceRef % weeks.length]
                }
            }
        }
    }, [APIUser, weeks])

    // Get the current week on mount
    useEffect(() => {
        getCurrentWeek()
    }, [getCurrentWeek])

    const value = {
        week,
        weeks,
        weekNo,
        changeWeek
    }

    // All components that use this context will have access to its value
    return <WeekContext.Provider value={value}>
        {children}
    </WeekContext.Provider>
}