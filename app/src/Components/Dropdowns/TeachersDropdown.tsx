import { Dispatch, SetStateAction, useState, useCallback, useEffect } from "react";
import Teacher, { TeacherInput } from "../../API/Teacher";
import { User } from "../../API/Users";
import { useUser } from "../../Hooks/useUser";
import CreateableAutocomplete from "../CreatableAutocomplete";
import EasyDialog from "../EasyDialog";

type TeachersDropdownProps = {
    autoFocus?: boolean
    teacher: TeacherInput|undefined
    setTeacher: Dispatch<SetStateAction<TeacherInput|undefined>>
}

// Create a dropdown for teachers with the ability to create, edit and delete teachers
export default function TeachersDropdown(props: TeachersDropdownProps) {
    const { autoFocus, teacher, setTeacher } = props

    const [teachers, setTeachers] = useState<Teacher[]>()
    const [teacherEditing, setTeacherEditing] = useState<TeacherInput>()

    const { userId } = useUser()

    const fetchTeachers = useCallback(async () => {
        setTeachers(
            await User.forge(userId).teachers?.get()
        )
    }, [userId])

    // Fetch teachers on mount
    useEffect(() => {
        fetchTeachers()
    }, [fetchTeachers])
    
    const createTeacher = async (name?: string) => {
        if(name) {
            const teacher = await User.forge(userId).teachers?.create(name as string)
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
            const teacher = await User.forge(userId).teachers?.get(teacherEditing._id)
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
            const teacher = await User.forge(userId).teachers?.get(id)
            if(teacher) await teacher.delete()
            setTeachers(teachers.filter(t => t._id !== id))
        }
    }

    return <>
        { teachers && <CreateableAutocomplete<TeacherInput>
            label="Teacher"
            autoFocus={autoFocus}
            options={teachers}
            chosenSetter={setTeacher}
            chosen={teacher!}
            onOpen={() => fetchTeachers()}
            save={([name]) => createTeacher(name)}
            edit={(item) => setTeacherEditing(item)}
            _delete={(item) => deleteTeacher(item._id)}
        /> }

        <EasyDialog
            title="Edit Teacher"
            fields={[{ label: "Name", type: "text", defaultValue: teacherEditing?.name }]}
            open={!!teacherEditing}
            done={([name]) => editTeacher(name)}
        />
    </>
}