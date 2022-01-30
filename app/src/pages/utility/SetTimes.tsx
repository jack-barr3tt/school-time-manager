import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SetTimes() {
    const navigate = useNavigate()
  return <div>
      <h2>Set Lesson Times</h2>
      <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} onClick={() => navigate("new")}>
            <Add/>
        </Fab>
  </div>;
}
