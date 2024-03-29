import { Save } from "@mui/icons-material";
import { Container, Fab, Slider, Stack, TextField, Typography } from "@mui/material";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../../API/Users";
import NavBar from "../../../Components/NavBar";
import { DayIndexToString } from "../../../functions";
import { useUser } from "../../../Hooks/useUser";

export default function NewRepeat() {
    const [name, setName] = useState<string>()
    const [days, setDays] = useState<number[]>([0,1])

    const { userId } = useUser()

    const navigate = useNavigate()

    const saveRepeat = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(name && days) {
            await User.forge(userId).repeats?.create({
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
                        valueLabelFormat={value => DayIndexToString(value, "long")}
                        onChange={(_e: Event, value: number|number[], active: number) => {
                            // value should always be an array but we confirm this for type-safety
                            if (!Array.isArray(value)) return
                        
                            // If left thumb is being moved, keep a minimum spacing of 1 day to the right thumb
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
            <Fab sx={{ position: "absolute", right: "24px", bottom: "24px" }} type="submit">
                <Save/>
            </Fab>
        </form>
    </>
}
