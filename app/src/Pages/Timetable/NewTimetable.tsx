import { Fab, Stack } from '@mui/material';
import { FormEvent, useCallback, useContext, useEffect, useState } from 'react';
import LessonBlock from '../../API/LessonBlock';
import Subject, { SubjectInput } from '../../API/Subjects';
import Location, { LocationInput } from "../../API/Location"
import Teacher, { TeacherInput } from "../../API/Teacher"
import { User } from '../../API/Users';
import { userContext } from '../../App';
import CreateableAutocomplete from '../../Components/CreatableAutocomplete';
import NavBar from '../../Components/NavBar';
import { Save } from '@mui/icons-material';
import Repeat from '../../API/Repeat';
import EasyDialog from '../../Components/EasyDialog';

type Props = {
    block: LessonBlock;
    repeat?: Repeat;
    day: number;
    back: () => void
}

export default function NewTimetable(props: Props) {
    const { block, repeat, day, back } = props 

    const [subject, setSubject] = useState<SubjectInput>()
    const [location, setLocation] = useState<LocationInput>()
    const [teacher, setTeacher] = useState<TeacherInput>()

    const [subjects, setSubjects] = useState<Subject[]>()
    const [locations, setLocations] = useState<Location[]>()
    const [teachers, setTeachers] = useState<Teacher[]>()

    const [newSubjectText, setNewSubjectText] = useState<string>()
    const [subjectDialogOpen, setSubjectDialogOpen] = useState<boolean>(false)

    const [subjectEditing, setSubjectEditing] = useState<SubjectInput>()
    const [locationEditing, setLocationEditing] = useState<LocationInput>()
    const [teacherEditing, setTeacherEditing] = useState<TeacherInput>()

    const user = useContext(userContext)

    const fetchData = useCallback(async () => {
        const [tempSubjects, tempLocations, tempTeachers] = await Promise.all([
            User.forge(user.id).subjects?.get(),
            User.forge(user.id).locations?.get(),
            User.forge(user.id).teachers?.get()
        ])
        setSubjects(tempSubjects)
        setLocations(tempLocations)
        setTeachers(tempTeachers)
    }, [user.id])

    const fetchSubjects = useCallback(async () => {
        setSubjects(
            await User.forge(user.id).subjects?.get()
        )
    }, [user.id])

    const fetchLocations = useCallback(async () => {
        setLocations(
            await User.forge(user.id).locations?.get()
        )
    }, [user.id])

    const fetchTeachers = useCallback(async () => {
        setTeachers(
            await User.forge(user.id).teachers?.get()
        )
    }, [user.id])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const saveTimetable = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(subject && subject._id && block && repeat) {           
            await User.forge(user.id).lessons?.create({
                subject_id: subject._id,
                block_id: block._id,
                location_id: location?._id,
                teacher_id: teacher?._id,
                repeat_id: repeat._id,
                day
            })
            back()
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
                await subject.edit({
                    name,
                    color
                })
                setSubjects(subjects.map(s => s._id === subjectEditing._id ? subject : s))
            }
        }
        setSubjectEditing(undefined)
    }
    
    const deleteSubject = async (id?: number) => {
        if(id && subjects) {
            const subject = await User.forge(user.id).subjects?.get(id)
            if(subject) await subject.delete()
            setSubjects(subjects.filter(s => s._id !== id))
        }
    }

    const createTeacher = async (name?: string) => {
        if(name) {
            const teacher = await User.forge(user.id).teachers?.create(name as string)
            if(teacher) {
                if(teachers) setTeachers(
                    [...teachers, teacher]
                )
                setTeacher(teacher)
            }
        }
    }

    const editTeacher = async (name?: string) => {
        if(teacherEditing && teacherEditing._id && teachers && name) {
            const teacher = await User.forge(user.id).teachers?.get(teacherEditing._id)
            if(teacher) {
                const editedTeacher = await teacher.edit({
                    name
                })
                setTeachers(teachers.map(t => t._id === teacherEditing._id ? teacher : t))
                setTeacher(editedTeacher)
            }
        }
        setTeacherEditing(undefined)
    }

    const deleteTeacher = async (id?: number) => {
        if(id && teachers) {
            const teacher = await User.forge(user.id).teachers?.get(id)
            if(teacher) await teacher.delete()
            setTeachers(teachers.filter(t => t._id !== id))
        }
    }

    const createLocation = async (name?: string) => {
        if(name) {
            const location = await User.forge(user.id).locations?.create(name as string)
            if(location) {
                if(locations) setLocations(
                    [...locations, location]
                )
                setLocation(location)
            }
        }
    } 
    
    const editLocation = async (name?: string) => {
        if(locationEditing && locationEditing._id && locations && name) {
            const location = await User.forge(user.id).locations?.get(locationEditing._id)
            if(location) {
                const editedLocation = await location.edit({
                    name
                })
                setLocations(locations.map(l => l._id === locationEditing._id ? location : l))
                setLocation(editedLocation)
            }
        }
        setLocationEditing(undefined)
    }

    const deleteLocation = async (id?: number) => {
        if(id && locations) {
            const location = await User.forge(user.id).locations?.get(id)
            if(location) await location.delete()
            setLocations(locations.filter(l => l._id !== id))
        }
    }


    return <>
        <NavBar name="New Timetable Entry" onBack={back}/>
        <form onSubmit={saveTimetable}>
            <Stack direction="column" spacing={2}>
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
                            open: subjectDialogOpen
                        },
                        textValueSetter: setNewSubjectText,
                        setOpen: setSubjectDialogOpen
                    }}
                    save={async ([name, color]) => createSubject(name, color)}
                    edit={(item) => setSubjectEditing(item)}
                    _delete={(item) => deleteSubject(item._id)}
                /> }

                { locations && <CreateableAutocomplete<LocationInput>
                    label="Location"
                    options={locations}
                    chosenSetter={setLocation}
                    chosen={location!}
                    onOpen={() => fetchLocations()}
                    save={async ([name]) => createLocation(name)}
                    edit={(item) => setLocationEditing(item)}
                    _delete={(item) => deleteLocation(item._id)}
                /> }

                { teachers && <CreateableAutocomplete<TeacherInput>
                    label="Teacher"
                    options={teachers}
                    chosenSetter={setTeacher}
                    chosen={teacher!}
                    onOpen={() => fetchTeachers()}
                    save={async ([name]) => createTeacher(name)}
                    edit={(item) => setTeacherEditing(item)}
                    _delete={(item) => deleteTeacher(item._id)}
                /> }
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
        <EasyDialog
            title="Edit Location"
            fields={[{ label: "Name", type: "text", defaultValue: locationEditing?.name }]}
            open={!!locationEditing}
            done={([name]) => editLocation(name)}
        />
        <EasyDialog
            title="Edit Teacher"
            fields={[{ label: "Name", type: "text", defaultValue: teacherEditing?.name }]}
            open={!!teacherEditing}
            done={([name]) => editTeacher(name)}
        />
    </>
}
