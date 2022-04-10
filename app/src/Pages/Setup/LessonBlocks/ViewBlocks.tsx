import { Add, } from '@mui/icons-material';
import { Fab, Skeleton } from '@mui/material';
import { compareAsc, format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonBlock from '../../../API/LessonBlock';
import { User } from '../../../API/Users';
import NavBar from '../../../Components/NavBar';
import SetupCard from '../../../Components/SetupCard';
import { MergeSort } from '../../../functions';
import { useUser } from '../../../Hooks/useUser';
import EditBlock from './EditBlock';

export default function ViewBlocks() {
    const [blocks, setBlocks] = useState<LessonBlock[]>()
    const [editing, setEditing] = useState(false)
    const [editingId, setEditingId] = useState<number>()
    
    const { userId } = useUser()
    const navigate = useNavigate()

    const fetchBlocks = useCallback(async () => {
        setBlocks(
            await User.forge(userId).lessonBlocks?.get()
        )
    }, [userId])

    // Fetch the blocks on mount or when edit mode is toggled
    useEffect(() => {
        fetchBlocks()
    }, [fetchBlocks, editing])

    const deleteBlock = async (id: number) => {
        if(blocks) {
            // Find the block to delete
            const block = blocks.find(t => t._id === id)
            if(block) {
                await block.delete()
                // Remove the block from the list
                setBlocks(
                    blocks.filter(t => t._id !== id)
                )
            }
        }
    }

    const sortedBlocks = blocks ? MergeSort(
        blocks, 
        (a, b) => compareAsc(a.start_time, b.start_time)
    ) : undefined

    return <>
        
        {
            !editing ? 
                <>
                    <NavBar name="Set Lesson Times"/>
                    {
                        sortedBlocks ? sortedBlocks.map(b => 
                                <SetupCard
                                    key={b._id}
                                    id={b._id}
                                    topText={b.name}
                                    bottomText={`${format(b.start_time, "kk:mm")} to ${format(b.end_time, "kk:mm")}`}
                                    setEditing={setEditing}
                                    setEditingId={setEditingId}
                                    deleteItem={() => deleteBlock(b._id)}
                                /> 
                            )
                        :
                            // Show 5 loading skeletons while blocks have not loaded
                            (new Array(5)).fill(0).map((_a, i) =>
                                <Skeleton key={""+i} variant="rectangular" height={92} animation="wave" sx={{ borderRadius: 1 }}/>
                            )
                    }
                    <Fab sx={{ position: "absolute", right: "24px", bottom: "24px" }} onClick={() => navigate("new")}>
                        <Add/>
                    </Fab>
                </>
            : 
                <EditBlock back={() => setEditing(false)} id={editingId}/>
        }
    </>
}