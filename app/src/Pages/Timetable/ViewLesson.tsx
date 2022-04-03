import { Circle, Edit, Place, Person, Delete } from '@mui/icons-material'
import { CircularProgress, IconButton, Stack, Typography } from '@mui/material'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Lesson from '../../API/Lesson'
import { User } from '../../API/Users'
import { userContext } from '../../App'
import NavBar from '../../Components/NavBar'
import { ColorIntToString } from '../../functions'
export default function ViewLesson() {
    const [lesson, setLesson] = useState<Lesson>()
    const [loading, setLoading] = useState<boolean>(true)
    
    const navigate = useNavigate()
    const { id } = useParams()
    const user = useContext(userContext)

    
    const fetchLesson = useCallback(async () => {
        if(id)
            try{
                setLesson(
                    await User.forge(user.id).lessons?.get(parseInt(id || "0"))
                )
                setLoading(false)
            }catch(err){
                navigate("/timetable")
            }
    }, [id, user.id, navigate])

    const deleteLesson = useCallback(async () => {
        if(lesson)
            try{
                await lesson.delete()
                navigate("/timetable")
            }catch(err){
                console.log(err)
            }
    }, [lesson, navigate])

    useEffect(() => {
        fetchLesson()
    }, [fetchLesson])
            
    return <>
        <NavBar
            name="View Lesson"
            controls={[
                <IconButton onClick={() => navigate(`../edit/${id}`)}>
                    <Edit/>
                </IconButton>,
                <IconButton onClick={deleteLesson}>
                    <Delete/>
                </IconButton>
            ]}
        />
        { loading && <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: 1 }}>
                <CircularProgress/>
            </Stack>
        }
        { lesson && <Stack direction="column" spacing={2}>
                <Stack direction="row" spacing={3} alignItems="center" sx={{ pt: 2 }}>
                    <Circle sx={{ color: ColorIntToString(lesson.subject.color) }}/>
                    <Typography variant="h5">Subject</Typography>
                </Stack>
                <Typography variant="body1">{lesson.subject.name}</Typography>

                <Stack direction="row" spacing={3} alignItems="center" sx={{ pt: 2 }}>
                    <Place/>
                    <Typography variant="h5">Location</Typography>
                </Stack>
                <Typography variant="body1">{lesson.location.name}</Typography>

                <Stack direction="row" spacing={3} alignItems="center" sx={{ pt: 2 }}>
                    <Person/>
                    <Typography variant="h5">Teacher</Typography>
                </Stack>
                <Typography variant="body1">{lesson.teacher.name}</Typography>
            </Stack>
        }
    </>
}
