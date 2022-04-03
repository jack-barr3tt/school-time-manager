import { Save } from '@mui/icons-material';
import { DatePicker } from '@mui/lab';
import { Fab, Slider, Stack, TextField, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { startOfDay } from 'date-fns';
import { FormEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubjectInput } from '../../API/Subjects';
import { User } from '../../API/Users';
import { userContext } from '../../App';
import NavBar from '../../Components/NavBar';
import SubjectsDropdown from '../../Components/Dropdowns/SubjectsDropdown';
import { MinutesToHrsMins } from '../../functions';

export default function NewHomework() {    
    const [task, setTask] = useState<string>();
    const [subject, setSubject] = useState<SubjectInput>();
    const [due, setDue] = useState<Date|null>();
    const [duration, setDuration] = useState<number>();

    const user = useContext(userContext)

    const navigate = useNavigate()

    const saveHomework = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(task && subject && subject._id) {
            await User.forge(user.id).homework?.create({
                task,
                subject_id: subject._id,
                due: due == null ? undefined : startOfDay(due).getTime(),
                duration
            })

            navigate('/homework')
        }
    }

    return <>
        <NavBar name="New Homework Task"/>
        <form onSubmit={saveHomework}>
            <Stack direction="column" spacing={2}>
                <TextField label="Task" fullWidth autoFocus onChange={(e) => setTask(e.target.value)} autoComplete='off'/>
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
                <Typography variant="h6" id="duration-label">Time to Complete</Typography>
                <Stack direction="row" sx={{ px: 3 }}>
                    <Slider
                        aria-labelledby="duration-label"
                        valueLabelFormat={MinutesToHrsMins}
                        onChangeCommitted={(_e,v) => setDuration(v as number)}
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