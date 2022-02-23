import { Save } from "@mui/icons-material"
import { Fab, Stack, TextField } from "@mui/material"
import { FormEvent, useCallback, useContext, useEffect, useState } from "react"
import Subject from "../../API/Subjects"
import { User } from "../../API/Users"
import { userContext } from "../../App"
import ColorPicker from "../../Components/ColorPicker"
import NavBar from "../../Components/NavBar"

type Props = {
    subject_id: number,
    back: () => void
}

export default function EditSubject(props: Props) {
    const { subject_id, back } = props

    const [subject, setSubject] = useState<Subject>()
    const [newName, setNewName] = useState<string>()
    const [newColor, setNewColor] = useState<number>()

    const user = useContext(userContext)

    const fetchSubject = useCallback(async () => {
        setSubject(
            await User.forge(user.id).subjects?.get(subject_id)
        )
    }, [subject_id, user.id])

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
            <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} type="submit">
                <Save/>
            </Fab>
        </form>
    </>
}