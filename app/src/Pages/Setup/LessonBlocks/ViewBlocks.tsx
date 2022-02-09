import { Add, Delete, Edit } from '@mui/icons-material';
import { ButtonGroup, Fab, IconButton, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { compareAsc, format } from 'date-fns';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonBlock from '../../../API/LessonBlock';
import { User } from '../../../API/Users';
import { userContext } from '../../../App';
import NavBar from '../../../Components/NavBar';
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
                            .map(b => <Paper key={b._id}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%", p: 2 }}>
                                    <Stack direction="column">
                                        <Typography variant="h6">{b.name}</Typography>
                                        <Typography variant="subtitle1">{`${format(b.start_time, "kk:mm")} to ${format(b.end_time, "kk:mm")}`}</Typography>
                                    </Stack>
                                    <ButtonGroup>
                                        <IconButton onClick={() => { setEditingId(b._id); setEditing(true); }} id={""+b._id}>
                                            <Edit/>
                                        </IconButton>
                                        <IconButton onClick={() => deleteBlock(b._id)} id={""+b._id}>
                                            <Delete/>
                                        </IconButton>
                                    </ButtonGroup>
                                </Stack>
                            </Paper> )
                        :
                            (new Array(5)).fill(
                                <Skeleton variant="rectangular" height={92} animation="wave" sx={{ borderRadius: 1 }}/>
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