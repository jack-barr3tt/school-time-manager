import { Save } from "@mui/icons-material";
import { Container, Fab, Slider, Stack, TextField, Typography } from "@mui/material";
import { FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../../API/Users";
import { userContext } from "../../../App";
import NavBar from "../../../Components/NavBar";

export default function NewRepeat() {
    const [name, setName] = useState<string>()
    const [days, setDays] = useState<number[]>([0,1])

    const user = useContext(userContext)
    const navigate = useNavigate()

    const saveRepeat = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(name && days && user) {
            await User.forge(user.id).repeats?.create({
                name,
                start_day: days[0],
                end_day: days[1]
            })
            navigate("/setup/repeats")
        }
    }

    return <>
        <NavBar name="New Repeat"/>
        <form onSubmit={saveRepeat}>
            <Stack direction="column" spacing={2}>
                <TextField 
                autoFocus
                    label="Name"
                    onChange={(e) => setName(e.target.value)}
                />
                <Typography variant="h6" id="day-label">Days</Typography>
                <Container sx={{ px: 2 }}>
                    <Slider
                        disableSwap
                        aria-labelledby="day-label"
                        value={days}
                        min={0}
                        max={6}
                        sx={{ alignSelf: "center" }}
                        valueLabelDisplay="auto"
                        valueLabelFormat={value => ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][value]}
                        onChange={(_e: Event, value: number|number[], active: number) => {
                            if (!Array.isArray(value)) return
                        
                            if (value[1] - value[0] < 1 && active === 0) {
                                const clamped = Math.min(value[0], 6 - 1)
                                setDays([clamped, clamped + 1])
                            } else {
                                setDays(value)
                            }
                        } }
                    />
                </Container>
            </Stack>
            <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} type="submit">
                <Save/>
            </Fab>
        </form>
    </>
}
