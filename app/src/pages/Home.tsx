import { Button, Grid, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return <>
        <Grid item>
            <Typography variant="h5" textAlign="center">Welcome</Typography>
        </Grid>
        <Grid item>
            <Link to="timetable">
                <Button variant="outlined" fullWidth>Timetable</Button>
            </Link>
        </Grid>
        <Grid item>
        <Link to="homework">
                <Button variant="outlined" fullWidth>Homework</Button>
            </Link>
        </Grid>
        <Grid item>
            <Link to="setup">
                <Button variant="outlined" fullWidth>Setup</Button>
            </Link>
        </Grid>
    </>
}
