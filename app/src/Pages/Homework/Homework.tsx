import { Add } from '@mui/icons-material';
import { CircularProgress, Fab, Stack } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Homework from '../../API/Homework';
import { User } from '../../API/Users';
import { userContext } from '../../App';
import HomeworkCard from '../../Components/HomeworkCard';
import NavBar from '../../Components/NavBar';

export default function HomeworkPage() {
    const [homework, setHomework] = useState<Homework[]>([])
    const navigate = useNavigate()

    const user = useContext(userContext)

    const [loading, setLoading] = useState<boolean>(true)
    
    useEffect(() => {
        User.forge(user.id).homework?.get().then(h => {
            setHomework(h as Homework[])
            setLoading(false)
        })
    }, [user.id])
    
    return <>
        <NavBar name="Homework"/>
        {loading && <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                <CircularProgress/>
            </Stack>
        } 
        <Stack direction="column" spacing={3} alignItems="center" sx={{ pt: 2 }}>
            {homework.sort((a,b) => {
                if(!a.due) return 0
                if(!b.due) return 0
                return a.due.getTime() - b.due.getTime()
            }).map(hw => <HomeworkCard key={hw.task} homework={hw} />)}
        </Stack>
        <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} onClick={() => navigate("new")}>
            <Add/>
        </Fab>
    </>
}