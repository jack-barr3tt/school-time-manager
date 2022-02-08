import { Save } from '@mui/icons-material';
import { TimePicker } from '@mui/lab';
import { Stack, TextField, Fab } from '@mui/material';
import { Dispatch, FormEvent, SetStateAction } from 'react';

type StoredDate = Date|null|undefined

type Props = {
    startTime: StoredDate;
    setStartTime: Dispatch<SetStateAction<StoredDate>>;
    endTime: StoredDate;
    setEndTime: Dispatch<SetStateAction<StoredDate>>;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function TimeRangePicker(props: Props) {
    const { startTime, setStartTime, endTime, setEndTime, onSubmit } = props
    return  <form onSubmit={onSubmit}>
        <Stack direction="column" spacing={2}>
            <TimePicker
                label="Start"
                renderInput={(params) => <TextField {...params} />}
                onChange={(e) => setStartTime(e)}
                value={startTime}
            />
            <TimePicker
                label="End"
                renderInput={(params) => <TextField {...params} />}
                onChange={(e) => setEndTime(e)}
                value={endTime}
                minTime={startTime}
                disabled={startTime == null}
            />
            <Fab 
                color="primary" 
                sx={{ position: "absolute", right: "24px", bottom: "24px" }} 
                type="submit" 
                disabled={startTime == null || endTime == null}
            >
                <Save/>
            </Fab>
        </Stack>
    </form>;
}
