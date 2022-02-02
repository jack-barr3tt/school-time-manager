import { Save } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Checkbox, Fab, Slider, Stack, TextField, Typography } from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Subject from '../../api/Subjects';
import { User } from '../../api/Users';
import { userContext } from '../../App';
import CreateableAutocomplete from '../../components/CreatableAutocomplete';
import { NavBar } from '../../components/NavBar';

export default function NewHomework() {
    interface SubjectInput {
        _id?: number;
        name: string;
        color?: number;
        inputValue?: string;
    }
    
    const [task, setTask] = useState<string>();
    const [subject, setSubject] = useState<SubjectInput>();
    const [due, setDue] = useState<Date|null>();
    const [difficultyGiven, setDifficultyGiven] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<number>();
    const [subjects, setSubjects] = useState<SubjectInput[]>([]);

    const user = useContext(userContext)

    const navigate = useNavigate()

    const fetchSubjects = useCallback(async () => {
        let fetchedSubjects = await User.forge(user.id).subjects?.get()
        if(fetchedSubjects) setSubjects(fetchedSubjects)
    }, [user.id])

    useEffect(() => {
        fetchSubjects()
    }, [fetchSubjects])

    const saveHomework = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if(!task) return
        if(!subject) return

        let chosenSubject: Subject|undefined;
        if(!subject._id) {
            chosenSubject = await User.forge(user.id).subjects?.create({
                name: subject.name,
                color: subject.color
            })
            if(chosenSubject) setSubjects([...subjects, chosenSubject])
        }else{
            chosenSubject = subject as Subject
        }
        if(!chosenSubject) return

        await User.forge(user.id).homework?.create({
            task,
            subject_id: chosenSubject._id,
            due: due?.getTime(),
            difficulty: difficulty
        })

        navigate('/homework')
    }

    return <>
        <NavBar name="New Homework Task"/>
        <form onSubmit={saveHomework}>
            <Stack direction="column" spacing={2}>
                <TextField label="Task" fullWidth autoFocus onChange={(e) => setTask(e.target.value)} autoComplete='off'/>
                <CreateableAutocomplete<SubjectInput> label="Subject" options={subjects} chosenSetter={setSubject} chosen={subject!} onOpen={(e) => {fetchSubjects()}}/>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker 
                        label="Due" 
                        value={due} 
                        onChange={(newValue) => setDue(newValue)}
                        renderInput={(props) => <TextField {...props} label="Due" fullWidth/>}
                    />
                </LocalizationProvider>
                <Typography variant="h6" id="difficulty-label">Difficulty</Typography>
                <Stack direction="row" alignItems="center">
                    <Checkbox 
                        checked={difficultyGiven} 
                        onChange={(event) => setDifficultyGiven(event.target.checked)}
                        sx={{ mr: 2}}
                    />
                    <Slider
                        aria-labelledby="difficulty-label"
                        valueLabelFormat={(value) => ["Easy", "Medium", "Hard"][value]}
                        onChangeCommitted={(_e,v) => setDifficulty(v as number)}
                        disabled={!difficultyGiven}
                        defaultValue={1}
                        valueLabelDisplay="auto"
                        step={1}
                        min={0}
                        max={2}
                    />
                </Stack>
            </Stack>
            <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} type="submit">
                <Save/>
            </Fab>
        </form>
    </>
}