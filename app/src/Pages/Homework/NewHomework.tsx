import { Save } from '@mui/icons-material';
import { DatePicker } from '@mui/lab';
import { Checkbox, Fab, Slider, Stack, TextField, Typography } from '@mui/material';
import { startOfDay } from 'date-fns';
import { FormEvent, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubjectInput } from '../../API/Subjects';
import { User } from '../../API/Users';
import { userContext } from '../../App';
import CreateableAutocomplete from '../../Components/CreatableAutocomplete';
import EasyDialog from '../../Components/EasyDialog';
import NavBar from '../../Components/NavBar';

export default function NewHomework() {    
    const [task, setTask] = useState<string>();
    const [subject, setSubject] = useState<SubjectInput>();
    const [due, setDue] = useState<Date|null>();
    const [difficultyGiven, setDifficultyGiven] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<number>();
    const [subjects, setSubjects] = useState<SubjectInput[]>();
    const [subjectEditing, setSubjectEditing] = useState<SubjectInput>();

    const [newSubjectText, setNewSubjectText] = useState<string>()
    const [subjectDialogOpen, setSubjectDialogOpen] = useState<boolean>(false)

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

        if(task && subject && subject._id) {
            await User.forge(user.id).homework?.create({
                task,
                subject_id: subject._id,
                due: due == null ? undefined : startOfDay(due).getTime(),
                difficulty: difficultyGiven ? (difficulty ? difficulty : 1) : undefined
            })

            navigate('/homework')
        }
    }

    const createSubject = async (name?: string, color?: number) => {
        if(name && color) {
            const createdSubject = await User.forge(user.id).subjects?.create({
                name,
                color
            })
            if(createdSubject) {
                if(subjects) setSubjects(
                    [...subjects, createdSubject]
                )
                setSubject(createdSubject)
            }
        }
        setSubjectDialogOpen(false)
    }

    const editSubject = async (name?: string, color?: number) => {
        if(subjectEditing && subjectEditing._id && subjects && (name || color)) {
            const subject = await User.forge(user.id).subjects?.get(subjectEditing._id)
            if(subject) {
                const editedSubject = await subject.edit({
                    name,
                    color
                })
                setSubjects(subjects.map(s => s._id === subjectEditing._id ? subject : s))
                setSubject(editedSubject)
            }
        }
        setSubjectEditing(undefined)
    }

    const deleteSubject = async (id?: number) => {
        if(id && subjects) {
            const subject = await User.forge(user.id).subjects?.get(id)
            if(subject) await subject.delete()
            fetchSubjects()
        }
    }

    return <>
        <NavBar name="New Homework Task"/>
        <form onSubmit={saveHomework}>
            <Stack direction="column" spacing={2}>
                <TextField label="Task" fullWidth autoFocus onChange={(e) => setTask(e.target.value)} autoComplete='off'/>
                { subjects && <CreateableAutocomplete<SubjectInput> 
                    label="Subject" 
                    options={subjects} 
                    chosenSetter={setSubject} 
                    chosen={subject!} 
                    onOpen={() => fetchSubjects()}
                    dialog={{
                        props: {
                            title: "New Subject",
                            fields: [
                                { label: "Name", type: "text", defaultValue: newSubjectText },
                                { label: "Color", type: "color" }
                            ],
                            open: subjectDialogOpen,
                        },
                        textValueSetter: setNewSubjectText,
                        setOpen: setSubjectDialogOpen
                    }}
                    save={async ([name, color]) => createSubject(name, color)}
                    edit={(item) => setSubjectEditing(item)}
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
        <EasyDialog
            title="Edit Subject"
            fields={[
                { label: "Name", type: "text", defaultValue: subjectEditing?.name },
                { label: "Color", type: "color", defaultValue: subjectEditing?.color }
            ]}
            open={!!subjectEditing}
            done={([name, color]) => editSubject(name, color)}
        />
    </>
}