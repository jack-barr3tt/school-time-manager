import { Edit } from "@mui/icons-material";
import { Select, MenuItem, IconButton } from "@mui/material";
import { useState } from "react";
import LessonBlock from "../../API/LessonBlock";
import Repeat from "../../API/Repeat";
import NavBar from "../../Components/NavBar";
import TimetableView from "../../Components/TimetableView";
import { useWeek } from "../../Hooks/useWeek";
import NewLesson from "./NewLesson";

type WeekSelectDropdownProps = { 
    weekNo: number, 
    weeks: Repeat[][], 
    changeWeek: (index?: number | undefined) => void 
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
    const { week, weeks, weekNo, changeWeek } = useWeek()

    const [editView, setEditView] = useState(false)
    const [creating, setCreating] = useState(false)
    const [createBlock, setCreateBlock] = useState<LessonBlock>()
    const [createDay, setCreateDay] = useState<number>()   
    
    return <>
        { !creating ?
            <>
                <NavBar name="Timetable" controls={[
                    <WeekSelectDropdown 
                        weekNo={weekNo} 
                        weeks={weeks} 
                        changeWeek={changeWeek}
                    />,
                    <IconButton key="edit-mode" onClick={() => setEditView(!editView)}>
                        <Edit/>
                    </IconButton>
                ]}/>
                <TimetableView
                    creating={creating}
                    editView={editView}
                    edit={ (block, day) => {
                        setCreating(true)
                        setCreateBlock(block)
                        setCreateDay(day)
                    }}
                />
            </>
        :  (createDay != null) && createBlock && week && 
                <NewLesson 
                    block={createBlock} 
                    repeat={week.find(r => r.end_day >= createDay && r.start_day <= createDay)} 
                    day={createDay} back={() => setCreating(false)}
                />
        }
    </>
}