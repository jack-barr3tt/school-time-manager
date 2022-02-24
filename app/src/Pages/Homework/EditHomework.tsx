import { Save } from "@mui/icons-material";
import { DatePicker } from "@mui/lab";
import { Stack, TextField, Typography, Checkbox, Slider, Fab } from "@mui/material";
import { useState, useContext, useCallback, useEffect, FormEvent } from "react";
import Homework from "../../API/Homework";
import Subject from "../../API/Subjects";
import { User } from "../../API/Users";
import { userContext } from "../../App";
import CreateableAutocomplete from "../../Components/CreatableAutocomplete";
import EasyDialog from "../../Components/EasyDialog";
import NavBar from "../../Components/NavBar";

type SubjectInput = {
    _id?: number;
    name: string;
    color?: number;
    inputValue?: string;
}

type Props = {
    id?: number;
    back: (goHome: boolean) => void;
}

export default function EditHomework(props: Props) {
    const { id, back } = props;

    const [task, setTask] = useState<string>("");
    const [subject, setSubject] = useState<SubjectInput>();
    const [due, setDue] = useState<Date|null>();
    const [difficultyGiven, setDifficultyGiven] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<number>();
    const [subjects, setSubjects] = useState<SubjectInput[]>([]);
    const [homework, setHomework] = useState<Homework>()

    const [newSubjectText, setNewSubjectText] = useState<string>()
    const [subjectDialogOpen, setSubjectDialogOpen] = useState<boolean>(false)

    const [subjectEditing, setSubjectEditing] = useState<SubjectInput>()

    const user = useContext(userContext);

    const fetchSubjects = useCallback(async () => {
        let fetchedSubjects = await User.forge(user.id).subjects?.get();
        if (fetchedSubjects) setSubjects(fetchedSubjects);
    }, [user.id]);

    const fetchHomework = useCallback(async () => {
        if(id) {
            let tempHomework = await User.forge(user.id).homework?.get(id);
            if (tempHomework) {
                setHomework(tempHomework)
                setTask(tempHomework.task);
                setSubject(tempHomework.subject);
                setDue(tempHomework.due);
                setDifficultyGiven(tempHomework.difficulty != null);
                setDifficulty(tempHomework.difficulty);
            }
        }
    }, [user.id, id]);

    useEffect(() => {
        fetchSubjects();
        fetchHomework();
    }, [fetchSubjects, fetchHomework]);

    const saveHomework = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(homework && task && subject) {
            try{
                await homework.edit({
                    task,
                    subject: { _id: subject._id} as Subject,
                    due: due == null ? undefined : due,
                    difficulty
                })
                back(false)
            }catch{}
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
                setSubject(createdSubject as SubjectInput)
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
                setSubjects(subjects.map(s => s._id === subjectEditing._id ? editedSubject : s))
                setSubject(editedSubject as SubjectInput)
            }
        }
        setSubjectEditing(undefined)
    }
    
    const deleteSubject = async (id?: number) => {
        if(id && subjects) {
            const subject = await User.forge(user.id).subjects?.get(id)
            if(subject) await subject.delete()
            back(true)
        }
    }

    return <>
        <NavBar name="Edit Homework" onBack={() => back(false)}/>
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
                <CreateableAutocomplete<SubjectInput> 
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
                />
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
    </>;
}