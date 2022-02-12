import { Add, } from '@mui/icons-material';
import { Fab, Skeleton } from '@mui/material';
import { compareAsc, format } from 'date-fns';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonBlock from '../../../API/LessonBlock';
import { User } from '../../../API/Users';
import { userContext } from '../../../App';
import NavBar from '../../../Components/NavBar';
import SetupCard from '../../../Components/SetupCard';
import EditBlock from './EditBlock';

export default function ViewBlocks() {
    const [blocks, setBlocks] = useState<LessonBlock[]>()
    const [editing, setEditing] = useState(false)
    const [editingId, setEditingId] = useState<number>()
    const navigate = useNavigate()

    const user = useContext(userContext)

    const fetchBlocks = useCallback(async () => {
        setBlocks(
            await User.forge(user.id).lessonBlocks?.get()
        )
    }, [user.id])

    useEffect(() => {
        fetchBlocks()
    }, [fetchBlocks, editing])

    const deleteBlock = async (id: number) => {
        if(blocks) {
            let block = blocks.find(t => t._id === id)
            if(block) {
                await block.delete()
                setBlocks(
                    blocks.filter(t => t._id !== id)
                )
            }
        }
    }

    return <>
        
        {
            !editing ? 
                <>
                    <NavBar name="Set Lesson Times"/>
                    {
                        blocks ? blocks
                            .sort((a, b) => compareAsc(a.start_time, b.start_time))
                            .map(b => <SetupCard
                                key={b._id}
                                id={b._id}
                                topText={b.name}
                                bottomText={`${format(b.start_time, "kk:mm")} to ${format(b.end_time, "kk:mm")}`}
                                setEditing={setEditing}
                                setEditingId={setEditingId}
                                deleteItem={() => deleteBlock(b._id)}
                            /> )
                        :
                            (new Array(5)).fill(0).map((_a, i) =>
                                <Skeleton key={""+i} variant="rectangular" height={92} animation="wave" sx={{ borderRadius: 1 }}/>
                            )
                    }
                    <Fab color="primary" sx={{ position: "absolute", right: "24px", bottom: "24px" }} onClick={() => navigate("new")}>
                        <Add/>
                    </Fab>
                </>
            : 
                <EditBlock back={() => setEditing(false)} id={editingId}/>
        }
    </>
}