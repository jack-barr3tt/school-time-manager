import { Fab, Stack } from '@mui/material';
import { FormEvent, useCallback, useContext, useEffect, useState } from 'react';
import LessonBlock from '../../API/LessonBlock';
import Subject, { SubjectInput } from '../../API/Subjects';
import Location, { LocationInput } from "../../API/Location"
import Teacher, { TeacherInput } from "../../API/Teacher"
import { User } from '../../API/Users';
import { userContext } from '../../App';
import CreateableAutocomplete from '../../Components/CreatableAutocomplete';
import CreateSubject from '../Subjects/CreateSubject';
import NavBar from '../../Components/NavBar';
import { Save } from '@mui/icons-material';
import Repeat from '../../API/Repeat';

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

        if(subject && block && repeat) {           
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

            let chosenLocation: Location|undefined;
            if(location) {
                if(!location._id) {
                    chosenLocation = await User.forge(user.id).locations?.create(location.name)
                    if(chosenLocation && locations) setLocations([...locations, chosenLocation])
                }else{
                    chosenLocation = location as Location
                }
                if(!chosenLocation) return
            }

            let chosenTeacher: Teacher|undefined;
            if(teacher) {
                if(!teacher._id) {
                    chosenTeacher = await User.forge(user.id).teachers?.create(teacher.name)
                    if(chosenTeacher && teachers) setTeachers([...teachers, chosenTeacher])
                }else{
                    chosenTeacher = teacher as Teacher
                }
                if(!chosenTeacher) return
            }

            await User.forge(user.id).lessons?.create({
                subject_id: chosenSubject._id,
                block_id: block._id,
                location_id: chosenLocation?._id,
                teacher_id: chosenTeacher?._id,
                repeat_id: repeat._id,
                day
            })
            back()
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
                    onOpen={() => {fetchSubjects()}}
                    CreateDialog={CreateSubject}
                /> }

                { locations && <CreateableAutocomplete<LocationInput>
                    label="Location"
                    options={locations}
                    chosenSetter={setLocation}
                    chosen={location!}
                    onOpen={() => fetchLocations()}
                /> }

                { teachers && <CreateableAutocomplete<TeacherInput>
                    label="Teacher"
                    options={teachers}
                    chosenSetter={setTeacher}
                    chosen={teacher!}
                    onOpen={() => fetchTeachers()}                
                /> }
            </Stack>
            <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} type="submit">
                <Save/>
            </Fab>
        </form>
    </>
}
