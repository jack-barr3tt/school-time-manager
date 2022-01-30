import { Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { SettingsButton } from '../components/SettingsButton';

export default function Setup() {
    const navigate = useNavigate()
    return <>
        <NavBar name="Setup"/>
        <Typography variant="h6">Timetable</Typography>
        <SettingsButton mainText="School Days" lowerText="5 days perk week" onClick={() => navigate("days")}/>
        <SettingsButton mainText="Lesson Times" lowerText="6 lessons per day" onClick={() => navigate("times")}/>
        <Typography variant="h6">Notifications</Typography>
        <SettingsButton mainText="Pre-warning" lowerText="10 minutes before" onClick={() => navigate("prewarning")}/>
    </>
}
