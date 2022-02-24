import { Save } from '@mui/icons-material';
import { DatePicker } from '@mui/lab';
import { Checkbox, Fab, Slider, Stack, TextField, Typography } from '@mui/material';
import { startOfDay } from 'date-fns';
import { FormEvent, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Subject, { SubjectInput } from '../../API/Subjects';
import { User } from '../../API/Users';
import { userContext } from '../../App';
import CreateableAutocomplete from '../../Components/CreatableAutocomplete';
import CreateSubject from '../Subjects/CreateSubject';
import NavBar from '../../Components/NavBar';
import EditSubject from '../Subjects/EditSubject';

export default function NewHomework() {    
    const [task, setTask] = useState<string>();
    const [subject, setSubject] = useState<SubjectInput>();
    const [due, setDue] = useState<Date|null>();
    const [difficultyGiven, setDifficultyGiven] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<number>();
    const [subjects, setSubjects] = useState<SubjectInput[]>();
    const [editing, setEditing] = useState<boolean>(false);
    const [editSubject, setEditSubject] = useState<SubjectInput>();

    const user = useContext(userContext)

    const navigate = useNavigate()

    const fetchSubjects = useCallback(async () => {
        let fetchedSubjects = await User.forge(user.id).subjects?.get()
        if(fetchedSubjects) setSubjects(fetchedSubjects)
    }, [user.id])

    useEffect(() => {
        fetchSubjects()
    }, [fetchSubjects])

    const saveHomework = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if(!task) return
        if(!subject) return

        let chosenSubject: Subject|undefined;
        if(!subject._id) {
            chosenSubject = await User.forge(user.id).subjects?.create({
                name: subject.name,
                color: subject.color
            })
            if(chosenSubject && subjects) setSubjects([...subjects, chosenSubject])
        }else{
            chosenSubject = subject as Subject
        }
        if(!chosenSubject) return

        await User.forge(user.id).homework?.create({
            task,
            subject_id: chosenSubject._id,
            due: due == null ? undefined : startOfDay(due).getTime(),
            difficulty: difficultyGiven ? (difficulty ? difficulty : 1) : undefined
        })

        navigate('/homework')
    }

    const deleteSubject = async (id?: number) => {
        if(id && subjects) {
            const subject = await User.forge(user.id).subjects?.get(id)
            if(subject) await subject.delete()
            fetchSubjects()
        }
    }

    return <>
        { !editing ?
            <>
                <NavBar name="New Homework Task"/>
                <form onSubmit={saveHomework}>
                    <Stack direction="column" spacing={2}>
                        <TextField label="Task" fullWidth autoFocus onChange={(e) => setTask(e.target.value)} autoComplete='off'/>
                        { subjects && <CreateableAutocomplete<SubjectInput> 
                            label="Subject" 
                            options={subjects} 
                            chosenSetter={setSubject} 
                            chosen={subject!} 
                            onOpen={() => {fetchSubjects()}}
                            CreateDialog={CreateSubject}
                            edit={(item) => {
                                setEditSubject(item)
                                setEditing(true)
                            }}
                            _delete={(item) => deleteSubject(item._id)}
                        /> }
                        <DatePicker 
                            label="Due" 
                            value={due} 
                            onChange={(newValue) => setDue(newValue)}
                            renderInput={(props) => <TextField {...props} label="Due" fullWidth/>}
                        />
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
                    <Fab sx={{ position: "absolute", right: "24px", bottom: "24px" }} type="submit">
                        <Save/>
                    </Fab>
                </form>
            </>
        :
            editSubject && editSubject._id && <EditSubject subject_id={editSubject._id} back={() => setEditing(false)}/>
    } </>
}