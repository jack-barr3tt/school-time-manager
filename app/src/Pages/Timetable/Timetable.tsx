import { Edit } from "@mui/icons-material";
import { Select, MenuItem, IconButton } from "@mui/material";
import { useState } from "react";
import LessonBlock from "../../API/LessonBlock";
import NavBar from "../../Components/NavBar";
import TimetableView from "../../Components/TimetableView";
import { useWeek, WeekProvider } from "../../Hooks/useWeek";
import NewTimetable from "./NewTimetable";

function Main() {
    const { week, weeks, weekNo, changeWeek } = useWeek()

    const [editView, setEditView] = useState(false)
    const [creating, setCreating] = useState(false)
    const [createBlock, setCreateBlock] = useState<LessonBlock>()
    const [createDay, setCreateDay] = useState<number>()   
    
    return <>
        { !creating ?
            <>
                <NavBar name="Timetable" controls={[
                    week && weeks && <Select
                        key="week-select"
                        variant="standard"
                        value={weekNo}
                        native={false}
                        renderValue={(value) => { 
                            if(weeks[value]) 
                                return weeks[value].map(r => r.name).join(', ')
                            else
                                return "" 
                        } }
                        onChange={(e) => changeWeek(+e.target.value)}
                    >
                        {
                            weeks.map((w, i) => <MenuItem key={i} value={i}>{w.map(r => r.name).join(', ')}</MenuItem>)
                        }
                    </Select>,
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
        : (createBlock != null) && (createDay != null) && week && <NewTimetable block={createBlock} repeat={week.find(r => r.end_day >= createDay && r.start_day <= createDay)} day={createDay} back={ () => setCreating(false) }/>
        }
    </>
}

export default function Timetable() {
    return <WeekProvider>
        <Main/>
    </WeekProvider>
}