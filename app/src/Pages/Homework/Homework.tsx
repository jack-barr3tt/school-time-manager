import { Add } from '@mui/icons-material';
import { CircularProgress, Fab, MenuItem, Select, Stack } from '@mui/material';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Homework from '../../API/Homework';
import { User } from '../../API/Users';
import { userContext } from '../../App';
import NavBar from '../../Components/NavBar';
import HomeworkByDue from './HomeworkByDue';

export default function HomeworkPage() {
    const [homework, setHomework] = useState<Homework[]>([])
    const [displayType, setDisplayType] = useState<'date'|'rec'>('date')

    const navigate = useNavigate()

    const user = useContext(userContext)

    const [loading, setLoading] = useState<boolean>(true)

    const loadHomework = useCallback(async () => {
        const tempHomework = await User.forge(user.id).homework?.get()
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
        <NavBar 
            name="Homework"
            controls={[
                <Select
                    key="week-select"
                    variant="standard"
                    value={displayType}
                    onChange={(e) => setDisplayType(e.target.value as 'date'|'rec')}
                >
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="rec">Reccomendation</MenuItem>
                </Select>
            ]}
        />
        {loading && <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                <CircularProgress/>
            </Stack>
        }
        { displayType === "date" ?
            <HomeworkByDue
                homework={homework}
                deleteHomework={deleteHomework}
                completeHomework={completeHomework}
            />
            :
            <div>Not ready yet</div>
        }
        <Fab sx={{ position: "absolute", right: "24px", bottom: "24px" }} onClick={() => navigate("new")}>
            <Add/>
        </Fab>
    </>
}