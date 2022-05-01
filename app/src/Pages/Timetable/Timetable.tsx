import { Edit } from "@mui/icons-material";
import { Select, MenuItem, IconButton } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import LessonBlock from "../../API/LessonBlock";
import Repeat from "../../API/Repeat";
import { User } from "../../API/Users";
import NavBar from "../../Components/NavBar";
import TimetableView from "../../Components/TimetableView";
import { useUser } from "../../Hooks/useUser";
import NewLesson from "./NewLesson";

type WeekSelectDropdownProps = { 
    weekNo: number, 
    weeks: Repeat[][], 
    changeWeek: (index?: number) => void 
}

function WeekSelectDropdown(props: WeekSelectDropdownProps) {
    const { weekNo, weeks, changeWeek } = props

    return <Select
        key="week-select"
        variant="standard"
        value={weekNo}
        native={false}
        renderValue={(value) => {
            if (weeks[value])
                return weeks[value].map(r => r.name).join(', ')

            else
                return "";
        } }
        onChange={(e) => changeWeek(+e.target.value)}
    >
        {weeks.map((w, i) => <MenuItem key={i} value={i}>{w.map(r => r.name).join(', ')}</MenuItem>)}
    </Select>
}

export default function Timetable() {
    const [editView, setEditView] = useState(false)
    const [creating, setCreating] = useState(false)
    const [createBlock, setCreateBlock] = useState<LessonBlock>()
    const [createDay, setCreateDay] = useState<number>()
    const [weekNo, setWeekNo] = useState<number>()
    const [weeks, setWeeks] = useState<Repeat[][]>()
    const [week, setWeek] = useState<Repeat[]>()

    const { userId } = useUser()

    const fetchData = useCallback(async () => {
        const [tempWeeks, tempWeek] = await Promise.all([
            User.forge(userId).lessons?.getWeeks(),
            User.forge(userId).lessons?.getWeek()
        ])
        if(tempWeeks) setWeeks(tempWeeks.repeats)
        if(tempWeek) {
            setWeekNo(tempWeek.no)
            setWeek(tempWeek.repeats)
        }
    }, [])
    
    useEffect(() => {
        fetchData()
    }, [fetchData])

    const changeWeek = async (index?: number) => {
        if(!weeks || index == null) return

        const newWeek = weeks[index]

        const user = await User.get(userId)
        if(user) {
            await user.setRepeat(newWeek[0]._id)
            fetchData()
        }
    }

    return <>
        { !creating ?
            <>
                { weekNo != null && <>
                    {   
                        weeks && <NavBar name="Timetable" controls={[
                            <WeekSelectDropdown 
                                weekNo={weekNo} 
                                weeks={weeks} 
                                changeWeek={changeWeek}
                            />,
                            <IconButton key="edit-mode" onClick={() => setEditView(!editView)}>
                                <Edit/>
                            </IconButton>
                        ]}/> 
                    }
                    <TimetableView
                        creating={creating}
                        editView={editView}
                        weekNo={weekNo}
                        edit={ (block, day) => {
                            setCreating(true)
                            setCreateBlock(block)
                            setCreateDay(day)
                        }}
                    />
                </> }
            </>
        :   (createDay != null) && createBlock && week &&
                <NewLesson 
                    block={createBlock} 
                    repeat={week.find(r => r.end_day >= createDay && r.start_day <= createDay)} 
                    day={createDay} back={() => setCreating(false)}
                />
        }
    </>
}