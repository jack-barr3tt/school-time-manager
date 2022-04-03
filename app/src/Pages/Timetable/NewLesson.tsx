import { Fab, Stack } from '@mui/material';
import { FormEvent, useContext, useState } from 'react';
import LessonBlock from '../../API/LessonBlock';
import { SubjectInput } from '../../API/Subjects';
import { LocationInput } from "../../API/Location"
import { TeacherInput } from "../../API/Teacher"
import { User } from '../../API/Users';
import { userContext } from '../../App';
import NavBar from '../../Components/NavBar';
import { Save } from '@mui/icons-material';
import Repeat from '../../API/Repeat';
import SubjectsDropdown from '../../Components/Dropdowns/SubjectsDropdown';
import TeachersDropdown from '../../Components/Dropdowns/TeachersDropdown';
import LocationsDropdown from '../../Components/Dropdowns/LocationsDropdown';

type Props = {
    block: LessonBlock;
    repeat?: Repeat;
    day: number;
    back: () => void
}

export default function NewLesson(props: Props) {
    const { block, repeat, day, back } = props 

    const [subject, setSubject] = useState<SubjectInput>()
    const [location, setLocation] = useState<LocationInput>()
    const [teacher, setTeacher] = useState<TeacherInput>()

    const user = useContext(userContext)    

    const saveLesson = async (e: FormEvent<HTMLFormElement>) => {
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

    return <>
        <NavBar name="New Timetable Entry" onBack={back}/>
        <form onSubmit={saveLesson}>
            <Stack direction="column" spacing={2}>
                <SubjectsDropdown
                    autoFocus
                    subject={subject}
                    setSubject={setSubject}
                />

                <TeachersDropdown
                    teacher={teacher}
                    setTeacher={setTeacher}
                />

                <LocationsDropdown
                    location={location}
                    setLocation={setLocation}
                />                
            </Stack>
            <Fab sx={{ position: "absolute", right: "24px", bottom: "24px" }} type="submit">
                <Save/>
            </Fab>
        </form>
    </>
}
