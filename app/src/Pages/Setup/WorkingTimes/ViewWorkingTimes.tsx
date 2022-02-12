import { Add } from '@mui/icons-material';
import { Fab, Skeleton } from '@mui/material';
import { format } from 'date-fns';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../API/Users';
import WorkingTime from '../../../API/WorkingTimes';
import { userContext } from '../../../App';
import NavBar from '../../../Components/NavBar';
import SetupCard from '../../../Components/SetupCard';
import EditWorkingTime from './EditWorkingTime';

export default function SetWorkingTimes() {
    const navigate = useNavigate()

    const [times, setTimes] = useState<WorkingTime[]>()
    const [editing, setEditing] = useState(false)
    const [editingId, setEditingId] = useState<number>()

    const user = useContext(userContext)

    const fetchWorkingTimes = useCallback(async () => {
        const times = await User.forge(user.id).workingTimes?.get()
        setTimes(times)
    }, [user.id])

    const deleteTime = async (id: number) => {
        if(times) {
            let time = times.find(t => t._id === id)
            if(time) {
                await time.delete()
                setTimes(
                    times.filter(t => t._id !== id)
                )
            }
        }
    }

    useEffect(() => {
        fetchWorkingTimes()
    }, [fetchWorkingTimes, editing])
    
    return <>
        {
            !editing ?
            <>
                <NavBar name="Set Working Times"/>
                {
                    times ?
                        times.map(t => <SetupCard
                            key={t._id}
                            id={t._id}
                            bottomText={`${format(t.start_time, "kk:mm")} to ${format(t.end_time, "kk:mm")}`}
                            setEditing={setEditing}
                            setEditingId={setEditingId}
                            deleteItem={() => deleteTime(t._id)}
                        />)
                    :
                        (new Array(5)).fill(0).map((_a, i) => 
                            <Skeleton key={""+i} variant="rectangular" height={56} animation="wave" sx={{ borderRadius: 1 }}/>
                        )
                }
                <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} onClick={() => navigate("new")}>
                    <Add/>
                </Fab>
            </> : <EditWorkingTime back={() => setEditing(false)} id={editingId}/>
        }
    </>;
}