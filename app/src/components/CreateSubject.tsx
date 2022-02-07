import { Check } from '@mui/icons-material';
import { Button, ButtonBase, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Stack, TextField } from '@mui/material';
import { orange, red, yellow, green, blue, purple } from '@mui/material/colors';
import { AxiosError } from 'axios';
import React, { Dispatch, FormEvent, SetStateAction, useContext, useEffect, useMemo, useState } from 'react';
import { User } from '../api/Users';
import { userContext } from '../App';

type Props<A> = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    defaultValue?: string;
    setFinal: Dispatch<SetStateAction<A>>;
}

export default function CreateSubject<T>(props: Props<T>) {
    const { open, setOpen, defaultValue, setFinal } = props;

    const colors = useMemo(() => [ red, orange, yellow, green, blue, purple ], []);

    const toArray = (color: object) => {
        const keys = Object.keys(color);
        const values = Object.values(color);
        
        return keys.map((key, index) => [key, values[index]]);
    }
    
    const [colorMatrix, setColorMatrix] = useState<string[][]>()
    const [checked, setChecked] = useState<{ x: number, y: number }>();
    const [subject, setSubject] = useState<string>();
    const [error, setError] = useState<string>();
    const user = useContext(userContext)

    useEffect(() =>
        setColorMatrix(
            colors.map(color =>
                toArray(color).filter(s => s[0].toString().length > 3).map(s => s[1])
            )
        )
    , [colors])

    useEffect(() => 
        setSubject(defaultValue)
    , [defaultValue])

    const saveSubject = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(colorMatrix && checked && subject) {
            const chosenColor = Number(colorMatrix[checked.x][checked.y].replace("#", "0x"));
            try {
                const createdSubject = await User.forge(user.id).subjects?.create({
                    name: subject,
                    color: chosenColor
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
        
    const colorButtons = <Stack direction="row" spacing={0.75} sx={{ p: 2 }}>
        { colorMatrix && colorMatrix.map((row, x) => {
                return <Stack direction="column" spacing={0.75} key={`stack-${x}`}>
                    { row.map((s, y) => 
                        <ButtonBase sx={{ borderRadius: "50%" }} onClick={() => setChecked({ x, y })} key={`${x}-${y}`}>
                            <Paper sx={{ backgroundColor: s, borderRadius: "50%", width: "2rem", aspectRatio: "1" }} >
                                { (checked && (x === checked.x && y === checked.y)) &&
                                    <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                                        <Check/> 
                                    </Stack>
                                }
                            </Paper>
                        </ButtonBase>
                    ) }
                </Stack>
            })
        }
    </Stack>

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
                {colorButtons}
                { error && <DialogContentText color="error.main">{error}</DialogContentText> }
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={checked == null || subject == null}>Save</Button>
            </DialogActions>
        </form>
    </Dialog>;
}
