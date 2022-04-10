import { Save } from "@mui/icons-material";
import { DatePicker } from "@mui/lab";
import { Stack, TextField, Typography, Slider, Fab } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useState, useCallback, useEffect, FormEvent } from "react";
import Homework from "../../API/Homework";
import Subject from "../../API/Subjects";
import { User } from "../../API/Users";
import NavBar from "../../Components/NavBar";
import SubjectsDropdown from "../../Components/Dropdowns/SubjectsDropdown";
import { MinutesToHrsMins } from "../../functions";
import { useUser } from "../../Hooks/useUser";

type SubjectInput = {
    _id?: number
    name: string
    color?: number
    inputValue?: string
}

type Props = {
    id?: number
    back: () => void
}

export default function EditHomework(props: Props) {
    const { id, back } = props

    const [task, setTask] = useState<string>("")
    const [subject, setSubject] = useState<SubjectInput>()
    const [due, setDue] = useState<Date|null>()
    const [duration, setDuration] = useState<number>()
    const [homework, setHomework] = useState<Homework>()

    const { userId } = useUser()

    const fetchHomework = useCallback(async () => {
        if(id) {
            const tempHomework = await User.forge(userId).homework?.get(id)
            if (tempHomework) {
                // If homework is successfully fetched, set the homework state
                setHomework(tempHomework)
                // And set the states of the values used by the form
                setTask(tempHomework.task)
                setSubject(tempHomework.subject)
                setDue(tempHomework.due)
                setDuration(tempHomework.duration)
            }
        }
    }, [userId, id])

    // Fetch the homework on mount
    useEffect(() => {
        fetchHomework()
    }, [fetchHomework])

    const saveHomework = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        // If all necessary values are set, save the homework
        if(homework && task && subject) {
            try{
                await homework.edit({
                    task,
                    subject: { _id: subject._id} as Subject,
                    due: due == null ? undefined : due,
                    duration
                })
                // If the homework was successfully saved, go back to the previous page
                back()
            }catch{}
        }
    }

    return <>
        <NavBar name="Edit Homework" onBack={back}/>
        <form onSubmit={saveHomework}>
            <Stack direction="column" spacing={2}>
                <TextField 
                    fullWidth
                    autoFocus
                    label="Task"
                    autoComplete='off'
                    onChange={(e) => setTask(e.target.value)} 
                    value={task}
                />
                <SubjectsDropdown
                    subject={subject}
                    setSubject={setSubject}
                />
                <DatePicker 
                    label="Due"
                    value={due} 
                    onChange={(newValue) => setDue(newValue)}
                    renderInput={(props) => <TextField {...props} label="Due" fullWidth/>}
                />
                <Typography variant="h6" id="duration-label">Duration</Typography>
                <Stack direction="row" sx={{ px: 4 }}>
                    <Slider
                        aria-labelledby="duration-label"
                        valueLabelFormat={MinutesToHrsMins}
                        onChangeCommitted={(_e,v) => setDuration(v as number)}
                        value={duration || 30}
                        sx={{ color: duration ? "primary.main" : grey[500] }}
                        defaultValue={30}
                        valueLabelDisplay="auto"
                        step={10}
                        min={10}
                        max={180}
                    />
                </Stack>
            </Stack>
            <Fab sx={{ position: "absolute", right: "24px", bottom: "24px" }} type="submit">
                <Save/>
            </Fab>
        </form>
    </>
}