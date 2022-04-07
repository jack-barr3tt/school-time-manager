import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import Subject, { SubjectInput } from "../../API/Subjects"
import { User } from "../../API/Users";
import { useUser } from "../../Hooks/useUser";
import CreateableAutocomplete from "../CreatableAutocomplete";
import EasyDialog from "../EasyDialog";

type SubjectsDropdownProps = {
    autoFocus?: boolean;
    subject: SubjectInput|undefined;
    setSubject: Dispatch<SetStateAction<SubjectInput|undefined>>;
}

export default function SubjectsDropdown(props: SubjectsDropdownProps) {
    const { autoFocus, subject, setSubject } = props

    const [subjects, setSubjects] = useState<Subject[]>()
    const [newSubjectText, setNewSubjectText] = useState<string>()
    const [subjectDialogOpen, setSubjectDialogOpen] = useState<boolean>(false)
    const [subjectEditing, setSubjectEditing] = useState<SubjectInput>()

    const { userId } = useUser()

    const fetchSubjects = useCallback(async () => {
        setSubjects(
            await User.forge(userId).subjects?.get()
        )
    }, [userId])

    useEffect(() => {
        fetchSubjects()
    }, [fetchSubjects])

    const createSubject = async (name?: string, color?: number) => {
        if(name) {
            const createdSubject = await User.forge(userId).subjects?.create({
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
            const subject = await User.forge(userId).subjects?.get(subjectEditing._id)
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
            const subject = await User.forge(userId).subjects?.get(id)
            if(subject) await subject.delete()
            setSubjects(subjects.filter(s => s._id !== id))
        }
    }

    return <>
        { subjects && <CreateableAutocomplete<SubjectInput> 
            label="Subject"
            autoFocus={autoFocus}
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
            save={([name, color]) => createSubject(name, color)}
            edit={(item) => setSubjectEditing(item)}
            _delete={(item) => deleteSubject(item._id)}
        /> }

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