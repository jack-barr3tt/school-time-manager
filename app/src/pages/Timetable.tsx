import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from '../components/NavBar';

export default function Timetable() {
  return <>
    <NavBar name="Timetable"/>
    <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }}>
        <Add/>
    </Fab>
  </>
}
