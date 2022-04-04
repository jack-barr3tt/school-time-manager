import { Save } from "@mui/icons-material"
import { Stack, TextField, Typography, Container, Slider, Fab } from "@mui/material"
import { useState, useCallback, useEffect, FormEvent } from "react"
import Repeat from "../../../API/Repeat"
import { User } from "../../../API/Users"
import NavBar from "../../../Components/NavBar"
import { DayIndexToString } from "../../../functions"
import { useUser } from "../../../Hooks/useUser"

type Props = {
    back: () => void;
    id?: number;
}

export default function EditRepeat(props: Props) {
    const { back, id } = props
    const [newName, setNewName] = useState<string>("")
    const [newDays, setNewDays] = useState<number[]>([0,1])
    const [repeat, setRepeat] = useState<Repeat>()

    const { userId } = useUser()

    const fetchRepeat = useCallback(async () => {
        if(id) {
            let tempRepeat = await User.forge(userId)?.repeats?.get(id)
            setRepeat(tempRepeat)
            if(tempRepeat) {
                setNewName(tempRepeat.name)
                setNewDays([tempRepeat.start_day, tempRepeat.end_day])
            }
        }
    }, [id, userId])

    useEffect(() => {
        fetchRepeat()
    }, [fetchRepeat])


    const saveRepeat = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(newName && newDays && repeat) {
            await repeat.edit({
                name: newName,
                start_day: newDays[0],
                end_day: newDays[1]
            })
            back()
        }
    }

    return <>
        <NavBar name="Edit Repeat" onBack={back}/>
        <form onSubmit={saveRepeat}>
            <Stack direction="column" spacing={2}>
                <TextField 
                autoFocus
                    label="Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <Typography variant="h6" id="day-label">Days</Typography>
                <Container sx={{ px: 2 }}>
                    <Slider
                        disableSwap
                        aria-labelledby="day-label"
                        value={newDays}
                        min={0}
                        max={6}
                        sx={{ alignSelf: "center" }}
                        valueLabelDisplay="auto"
                        valueLabelFormat={value => DayIndexToString(value, "long")}
                        onChange={(_e: Event, value: number|number[], active: number) => {
                            if (!Array.isArray(value)) return
                        
                            if (value[1] - value[0] < 1 && active === 0) {
                                const clamped = Math.min(value[0], 6 - 1)
                                setNewDays([clamped, clamped + 1])
                            } else {
                                setNewDays(value)
                            }
                        } }
                    />
                </Container>
            </Stack>
            <Fab sx={{ position: "absolute", right: "24px", bottom: "24px" }} type="submit">
                <Save/>
            </Fab>
        </form>
    </>
}
