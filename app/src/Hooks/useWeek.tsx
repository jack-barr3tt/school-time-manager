import { differenceInWeeks } from "date-fns";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import Repeat from "../API/Repeat";
import { User } from "../API/Users";
import { userContext } from "../App";
import { RepeatsToWeeks } from "../functions";

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

    const [APIUser, setAPIUser] = useState<User>();
    const [week, setWeek] = useState<Repeat[]>();
    const [weekNo, setWeekNo] = useState<number>();
    const [repeats, setRepeats] = useState<Repeat[]>();
    const [weeks, setWeeks] = useState<Repeat[][]>([]);

    const user = useContext(userContext)

    const fetchData = useCallback(async () => {
        const [tempUser, tempRepeats] = await Promise.all([
            User.get(user.id),
            User.forge(user.id).repeats?.get()
        ])
        setAPIUser(tempUser)
        setRepeats(tempRepeats)
    }, [user.id])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        if(repeats) setWeeks(RepeatsToWeeks(repeats))
    }, [repeats])

    const changeWeek = async (index?: number) => {
        if(weeks && APIUser && index != null) {
            let pickedWeek = weeks[index]
            await APIUser.setRepeat(pickedWeek[0]._id)
            setWeek(pickedWeek)
            fetchData()
        }
    }

    const getCurrentWeek = useCallback(() => {
        if(APIUser) {
            let repeatId = APIUser.repeat?._id
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

    useEffect(() => {
        getCurrentWeek()
    }, [getCurrentWeek])

    const value = {
        week,
        weeks,
        weekNo,
        changeWeek
    }

    return <WeekContext.Provider value={value}>
        {children}
    </WeekContext.Provider>
}