import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { AxiosError } from 'axios';
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';
import { User } from '../../API/Users';
import ColorPicker from '../../Components/ColorPicker';
import { useUser } from '../../Hooks/useUser';

type Props<A> = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    defaultValue?: string;
    setFinal: Dispatch<SetStateAction<A>>;
}

export default function CreateSubject<T>(props: Props<T>) {
    const { open, setOpen, defaultValue, setFinal } = props;

    const [color, setColor] = useState<number>();
    const [subject, setSubject] = useState<string>();
    const [error, setError] = useState<string>();

    const { userId } = useUser()

    useEffect(() => 
        setSubject(defaultValue)
    , [defaultValue])

    const saveSubject = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(color && subject) {
            try {
                const createdSubject = await User.forge(userId).subjects?.create({
                    name: subject,
                    color: color
                })
                if(createdSubject) {
                    setFinal((createdSubject as unknown) as T)
                    setOpen(false)
                }
            }catch(e){
                const error = e as AxiosError
                const err = error.response?.data
                if(err.message) setError(err.message)
            }
        }
    }

    return <Dialog open={open}>
        <form onSubmit={saveSubject}>
            <DialogTitle>Create Subject</DialogTitle>
            <DialogContent>
                <TextField 
                    autoFocus
                    label="Name"  
                    margin="dense"
                    fullWidth
                    error={error != null}
                    onFocus={() => setError(undefined)}
                    value={subject || ""}
                    onChange={(e) => setSubject(e.target.value)}
                />
                <ColorPicker setColor={setColor}/>
                { error && <DialogContentText color="error.main">{error}</DialogContentText> }
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={color == null || subject == null}>Save</Button>
            </DialogActions>
        </form>
    </Dialog>;
}
