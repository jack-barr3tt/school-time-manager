import { Save } from "@mui/icons-material";
import { Fab, Stack } from "@mui/material";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Lesson from "../../API/Lesson";
import Location, { LocationInput } from "../../API/Location";
import Subject, { SubjectInput } from "../../API/Subjects";
import Teacher, { TeacherInput } from "../../API/Teacher";
import { User } from "../../API/Users";
import NavBar from "../../Components/NavBar";
import LocationsDropdown from "../../Components/Dropdowns/LocationsDropdown";
import SubjectsDropdown from "../../Components/Dropdowns/SubjectsDropdown";
import TeachersDropdown from "../../Components/Dropdowns/TeachersDropdown";
import { useUser } from "../../Hooks/useUser";

export default function EditLesson() {
    const [lesson, setLesson] = useState<Lesson>()

    const [subject, setSubject] = useState<SubjectInput>()
    const [location, setLocation] = useState<LocationInput>()
    const [teacher, setTeacher] = useState<TeacherInput>()

    const { id } = useParams()
    const navigate = useNavigate()
    const { userId } = useUser()
    
    const fetchLesson = useCallback(async () => {
        const tempLesson = await User.forge(userId).lessons?.get(parseInt(id || "0"))
        if(tempLesson) {
            // If the lesson was successfully fetched, set the lesson state
            setLesson(tempLesson)
            // And set the states of the values used by the form
            setSubject(tempLesson.subject)
            setLocation(tempLesson.location)
            setTeacher(tempLesson.teacher)
        }
    }, [userId, id])

    // Fetch lessons on mount
    useEffect(() => {
        fetchLesson()
    }, [fetchLesson])

    const saveLesson = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(lesson && subject && subject._id) {
            try {
                await lesson.edit({
                    subject: { _id: subject._id } as Subject,
                    location: { _id: location?._id } as Location,
                    teacher: { _id: teacher?._id } as Teacher
                })
                navigate("/timetable")
            }catch{}
        }
    }
    
    return <>
        <NavBar
            name="Edit Lesson"
            onBack={() => navigate("/timetable")}
        />
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
