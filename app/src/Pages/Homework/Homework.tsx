import { Add } from '@mui/icons-material';
import { CircularProgress, Fab, Stack } from '@mui/material';
import { useCallback, useContext, useEffect, useState } from 'react';
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

    const loadHomework = useCallback(async () => {
        let tempHomework = await User.forge(user.id).homework?.get()
        if(tempHomework) {
            setHomework(tempHomework)
            setLoading(false)
        }
    }, [user.id])
    
    useEffect(() => {
        loadHomework()    
    }, [loadHomework])

    const deleteHomework = async (hw: Homework) => {
        await hw.delete()
        setHomework(homework.filter(h => h._id !== hw._id))
    }

    const completeHomework = async (hw: Homework) => {
        await hw.markComplete()
        let replacement = await User.forge(user.id).homework?.get(hw._id)
        if(replacement) setHomework([
            ...homework.filter(h => h._id !== hw._id),
            replacement
        ])
    }
    
    return <>
        <NavBar name="Homework"/>
        {loading && <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                <CircularProgress/>
            </Stack>
        } 
        <Stack direction="column" spacing={3} alignItems="center" sx={{ pt: 2 }}>
            {homework.filter(h => !h.complete).sort((a,b) => {
                if(!a.due) return 0
                if(!b.due) return 0
                return a.due.getTime() - b.due.getTime()
            }).map(hw => <HomeworkCard key={hw._id} homework={hw} _delete={() => deleteHomework(hw)} complete={() => completeHomework(hw)} />)}
        </Stack>
        <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} onClick={() => navigate("new")}>
            <Add/>
        </Fab>
    </>
}