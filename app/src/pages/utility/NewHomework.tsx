import { Save } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Checkbox, Fab, Slider, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import CreateableAutocomplete from '../../components/CreatableAutocomplete';
import { NavBar } from '../../components/NavBar';

export default function NewHomework() {
    const [task, setTask] = useState<string>();
    const [subject, setSubject] = useState<SubjectInput>();
    const [due, setDue] = useState<Date|null>();
    const [difficultyGiven, setDifficultyGiven] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<number>();

    interface SubjectInput {
        id?: string;
        name: string;
        color?: number;
        inputValue?: string;
    }

    const [subjects, setSubjects] = useState<SubjectInput[]>([]);

    const saveHomework = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    return <>
        <NavBar name="New Homework Task"/>
        <form onSubmit={saveHomework}>
            <Stack direction="column" spacing={2}>
                <TextField label="Task" fullWidth autoFocus onChange={(e) => setTask(e.target.value)} autoComplete='off'/>
                <CreateableAutocomplete<SubjectInput> label="Subject" options={subjects} chosenSetter={setSubject} chosen={subject!}/>
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