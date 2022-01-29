import { Settings } from '@mui/icons-material';
import { Button, ButtonBase, Stack, Typography } from '@mui/material';
import React from 'react';
import { NavBar } from '../components/NavBar';
import { SettingsButton } from '../components/SettingsButton';

export default function Setup() {
    return <>
        <NavBar name="Setup"/>
        <Typography variant="h6">Timetable</Typography>
        <SettingsButton mainText="School Days" lowerText="5 days perk week"/>
        <SettingsButton mainText="Lesson Times" lowerText="6 lessons per day"/>
        <Typography variant="h6">Notifications</Typography>
        <SettingsButton mainText="Pre-warning" lowerText="10 minutes before"/>
    </>
}
