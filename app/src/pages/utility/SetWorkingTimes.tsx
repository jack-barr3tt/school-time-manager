import { Add, Delete, Edit } from '@mui/icons-material';
import { ButtonGroup, Container, Fab, IconButton, Paper, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../api/Users';
import WorkingTime from '../../api/WorkingTimes';
import { userContext } from '../../App';
import { NavBar } from '../../components/NavBar';

export default function SetWorkingTimes() {
    const navigate = useNavigate()

    const [times, setTimes] = useState<WorkingTime[]>()

    const user = useContext(userContext)

    const fetchWorkingTimes = useCallback(async () => {
        const times = await User.forge(user.id).workingTimes?.get()
        setTimes(times)
        console.log(times)
    }, [user.id])

    useEffect(() => {
        fetchWorkingTimes()
    }, [fetchWorkingTimes])
    
    return <>
        <NavBar name="Set Working Times"/>
        <Stack>
            {
                times && times.map(t => <Paper key={t._id}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%", p: 2 }}>
                        <Typography variant="subtitle1">{`${format(t.start_time, "kk:mm")} to ${format(t.end_time, "kk:mm")}`}</Typography>
                        <ButtonGroup>
                            <IconButton>
                                <Edit/>
                            </IconButton>
                            <IconButton>
                                <Delete/>
                            </IconButton>
                        </ButtonGroup>
                    </Stack>
                </Paper>)
            }
        </Stack>
        <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} onClick={() => navigate("new")}>
            <Add/>
        </Fab>
    </>;
}
