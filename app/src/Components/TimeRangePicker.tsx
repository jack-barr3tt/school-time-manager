import { Save } from '@mui/icons-material';
import { TimePicker } from '@mui/lab';
import { TextField, Fab } from '@mui/material';
import { add } from 'date-fns';
import { Dispatch, SetStateAction, useEffect } from 'react';

export type OptionalDate = Date|null|undefined

type Props = {
    startTime: OptionalDate;
    setStartTime: Dispatch<SetStateAction<OptionalDate>>;
    endTime: OptionalDate;
    setEndTime: Dispatch<SetStateAction<OptionalDate>>;
    autoDifference?: Duration;
}

export default function TimeRangePicker(props: Props) {
    const { startTime, setStartTime, endTime, setEndTime, autoDifference } = props

    useEffect(() => {
        setStartTime(new Date())
    }, [setStartTime])

    return <>
        <TimePicker
            label="Start"
            renderInput={(params) => <TextField {...params} />}
            onChange={(e) => { setStartTime(e); if(autoDifference && startTime) setEndTime(add(startTime, autoDifference)) } }
            value={startTime}
        />
        <TimePicker
            label="End"
            renderInput={(params) => <TextField {...params} />}
            onChange={(e) => setEndTime(e) }
            value={endTime}
            minTime={startTime}
            disabled={startTime == null}
        />
        <Fab 
            sx={{ position: "absolute", right: "24px", bottom: "24px" }} 
            type="submit" 
        >
            <Save/>
        </Fab>
    </>
}
