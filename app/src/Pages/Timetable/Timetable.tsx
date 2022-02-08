import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../Components/NavBar';

export default function Timetable() {
    const navigate = useNavigate()
  return <>
    <NavBar name="Timetable"/>
    <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} onClick={() => navigate("new")}>
        <Add/>
    </Fab>
  </>
}
