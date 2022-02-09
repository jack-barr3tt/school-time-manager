import { Stack, TextField } from '@mui/material';
import { FormEvent, useCallback, useContext, useEffect, useState } from 'react';
import LessonBlock from '../../../API/LessonBlock';
import { User } from '../../../API/Users';
import { userContext } from '../../../App';
import NavBar from '../../../Components/NavBar';
import TimeRangePicker from '../../../Components/TimeRangePicker';

export default function EditWorkingTime(props: { back: () => void, id?: number }) {
    const { back, id } = props
    const [newName, setNewName] = useState<string>()
    const [newStartTime, setNewStartTime] = useState<Date|null>()
    const [newEndTime, setNewEndTime] = useState<Date|null>()
    const [block, setBlock] = useState<LessonBlock>()

    const user = useContext(userContext)

    const fetchBlock = useCallback(async () => {
        if(id)
            setBlock(
                await User.forge(user.id)?.lessonBlocks?.get(id)
            )
    }, [id, user.id])

    useEffect(() => {
        if(block) {
            setNewName(block.name)
            setNewStartTime(block.start_time)
            setNewEndTime(block.end_time)
        }
    }, [block])

    useEffect(() => {   
        fetchBlock()
    }, [fetchBlock])

    const saveBlock = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(newStartTime && newEndTime) {
            try{
                await block?.edit({
                    name: newName,
                    start_time: newStartTime,
                    end_time: newEndTime
                })
                back()
            }catch{}
        }
    }

    return <>
        <NavBar name="Edit Working Time" onBack={back}/>
        <form onSubmit={saveBlock}>
            <Stack direction="column" spacing={2}>
                <TextField
                    label="Name"
                    autoFocus
                    fullWidth
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <TimeRangePicker
                    startTime={newStartTime}
                    setStartTime={setNewStartTime}
                    endTime={newEndTime}
                    setEndTime={setNewEndTime}
                />
            </Stack>
        </form>
    </>
}
