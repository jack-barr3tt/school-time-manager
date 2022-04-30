import { Stack, TextField } from '@mui/material';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import LessonBlock from '../../../API/LessonBlock';
import { User } from '../../../API/Users';
import NavBar from '../../../Components/NavBar';
import TimeRangePicker from '../../../Components/TimeRangePicker';
import { useUser } from '../../../Hooks/useUser';

export default function EditWorkingTime(props: { back: () => void, id?: number }) {
    const { back, id } = props
    const [newName, setNewName] = useState<string>()
    const [newStartTime, setNewStartTime] = useState<Date|null>()
    const [newEndTime, setNewEndTime] = useState<Date|null>()
    const [block, setBlock] = useState<LessonBlock>()

    const { userId } = useUser()

    const fetchBlock = useCallback(async () => {
        if(id) {
            const tempBlock = await User.forge(userId)?.lessonBlocks?.get(id)
            if(tempBlock) {
                // If the block is successfully fetched, set the block state
                setBlock(tempBlock)
                // And set the states of the values used by the form
                setNewName(tempBlock.name)
                setNewStartTime(tempBlock.start_time)
                setNewEndTime(tempBlock.end_time)
            }
        }
    }, [id, userId])

    // Fetch the block on mount
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
        <NavBar name="Edit Lesson Block" onBack={back}/>
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
