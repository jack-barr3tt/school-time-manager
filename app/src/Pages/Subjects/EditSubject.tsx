import { Save } from "@mui/icons-material"
import { Fab, Stack, TextField } from "@mui/material"
import { FormEvent, useCallback, useEffect, useState } from "react"
import Subject from "../../API/Subjects"
import { User } from "../../API/Users"
import ColorPicker from "../../Components/ColorPicker"
import NavBar from "../../Components/NavBar"
import { useUser } from "../../Hooks/useUser"

type Props = {
    subject_id: number,
    back: () => void
}

export default function EditSubject(props: Props) {
    const { subject_id, back } = props

    const [subject, setSubject] = useState<Subject>()
    const [newName, setNewName] = useState<string>()
    const [newColor, setNewColor] = useState<number>()

    const { userId } = useUser()

    const fetchSubject = useCallback(async () => {
        setSubject(
            await User.forge(userId).subjects?.get(subject_id)
        )
    }, [subject_id, userId])

    useEffect(() => {
        if(subject) {
            setNewName(subject.name)
            setNewColor(subject.color)
        }
    }, [subject])

    useEffect(() => {
        fetchSubject()
    }, [fetchSubject])

    const saveSubject = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if((newName || newColor) && subject) {
            await subject.edit({
                name: newName,
                color: newColor
            })
            back()
        }
    }

    return <>
        <NavBar name="Edit Subject" onBack={back}/>
        <form onSubmit={saveSubject}>
            <Stack direction="column" spacing={2} alignItems="center">
                <TextField
                    fullWidth
                    autoFocus
                    label="Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <ColorPicker setColor={setNewColor} defaultValue={newColor}/>
            </Stack>
            <Fab sx={{ position: "absolute", right: "24px", bottom: "24px" }} type="submit">
                <Save/>
            </Fab>
        </form>
    </>
}