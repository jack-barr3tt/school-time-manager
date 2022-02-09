import { Save } from '@mui/icons-material';
import { Stack, Slider, Typography, Fab } from '@mui/material';
import { FormEvent, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../API/Users';
import { userContext } from '../../App';
import NavBar from '../../Components/NavBar';

export default function PreWarning() {
    const [prewarning, setPrewarning] = useState<number>()
    const [fetchedUser, setFetchedUser] = useState<User>()

    const user = useContext(userContext)
    const navigate = useNavigate()

    const fetchUser = useCallback(async () => {
        setFetchedUser(await User.get(user.id))
    }, [user.id])

    useEffect(() => {
        if(fetchedUser && fetchedUser.prewarning) setPrewarning(fetchedUser.prewarning)
    }, [fetchedUser])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    const savePrewarning = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(prewarning && fetchedUser) {
            await fetchedUser.setPreWarning(prewarning)
            navigate("/setup")
        }
    }

    return <>
        <NavBar name="Set Notification Pre-warning"/>
        <form onSubmit={savePrewarning}>
            <Stack direction="column" spacing={2}>
                <Typography variant="h6" id="prewarn-label">Notification Pre-warning</Typography>
                <Slider
                    aria-label="Pre-warning"
                    aria-labelledby="prewarn-label"
                    defaultValue={10}
                    valueLabelDisplay="auto"
                    step={5}
                    min={0}
                    max={30}
                    onChangeCommitted={(_e,v) => setPrewarning(v as number)}
                    value={prewarning}
                />
            </Stack>
            <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} type="submit">
                <Save/>
            </Fab>
        </form>
    </>
}
