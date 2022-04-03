import { Dispatch, SetStateAction, useState, useCallback, useContext, useEffect } from "react";
import Teacher, { TeacherInput } from "../../API/Teacher";
import { User } from "../../API/Users";
import { userContext } from "../../App";
import CreateableAutocomplete from "../CreatableAutocomplete";
import EasyDialog from "../EasyDialog";

type TeachersDropdownProps = {
    autoFocus?: boolean;
    teacher: TeacherInput|undefined;
    setTeacher: Dispatch<SetStateAction<TeacherInput|undefined>>;
}

export default function TeachersDropdown(props: TeachersDropdownProps) {
    const { autoFocus, teacher, setTeacher } = props

    const [teachers, setTeachers] = useState<Teacher[]>()

    const [teacherEditing, setTeacherEditing] = useState<TeacherInput>()

    const user = useContext(userContext)

    const fetchTeachers = useCallback(async () => {
        setTeachers(
            await User.forge(user.id).teachers?.get()
        )
    }, [user.id])

    useEffect(() => {
        fetchTeachers()
    }, [fetchTeachers])
    
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

    return <>
        { teachers && <CreateableAutocomplete<TeacherInput>
            label="Teacher"
            autoFocus={autoFocus}
            options={teachers}
            chosenSetter={setTeacher}
            chosen={teacher!}
            onOpen={() => fetchTeachers()}
            save={async ([name]) => createTeacher(name)}
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