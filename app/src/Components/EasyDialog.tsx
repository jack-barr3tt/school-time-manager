import { Dialog, DialogTitle, DialogContent, Button, DialogActions, TextField, Stack, Typography } from "@mui/material"
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import ColorPicker from "./ColorPicker"

type Field = {
    type: "text"|"color";
    label: string
    defaultValue?: string|number
}

export type FullEasyDialogProps = EasyDialogProps & {
    done: (data: any[]) => void
}

export type EasyDialogProps = {
    title: string
    fields: Field[]
    open: boolean
}

export default function EasyDialog(props: FullEasyDialogProps) {
    const { title, fields, open, done } = props

    const [setup, setSetup] = useState<boolean>(false)

    // I need to store an array of states for each of the dialog inputs, however this is not best practice so I need to disable the warnings that will be shown
    const states = fields.map(f => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        if(f.type === "text") return useState<string>()
        // eslint-disable-next-line react-hooks/rules-of-hooks
        else return useState<number>()
    })

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        // States are a tuple, and the first item is the value of the state, so the done function is called with the values of the states
        done(states.map(s => s[0]))
    }

    // When the dialog opens, we need to set the values of the states to their default values
    useEffect(() => {
        if(open && !setup) {
            states.forEach((s, i) => {
                if(fields[i].type === "text") {
                    const stateSetter = s[1] as Dispatch<SetStateAction<string>> // The state setter function is the second item in a state tuple
                    stateSetter((fields[i].defaultValue as string) || "") // Set the value of the state to the default value
                }else{
                    const stateSetter = (s[1] as Dispatch<SetStateAction<number>>)  // The state setter function is the second item in a state tuple
                    stateSetter((fields[i].defaultValue as number) || 0) // Set the value of the state to the default value
                }
            })
            setSetup(true)
        }
    }, [fields, open, setup, states])

    return <Dialog open={open}>
        <form onSubmit={submit}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={2} sx={{ pt: 2 }}>
                    {
                        fields.map((f, i) => {
                            if(f.type === "text") {
                                return <TextField
                                    key={i}
                                    autoFocus={i === 0}
                                    fullWidth
                                    label={f.label}
                                    value={states[i][0] || ""}
                                    onChange={(e) => (states[i][1] as Dispatch<SetStateAction<string>>)(e.target.value)}
                                />
                            }else{
                                return <div key={i}>
                                    <Typography variant="h6">{f.label}</Typography>
                                    <ColorPicker
                                        key={i}
                                        setColor={(color) => (states[i][1] as Dispatch<SetStateAction<number>>)(color)}
                                        defaultValue={states[i][0] as number}
                                    />
                                </div>
                            }
                        })
                    }
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => done(states.map(_ => null))}>Cancel</Button>
                <Button type="submit" color="primary">Save</Button>
            </DialogActions>
        </form>
    </Dialog>
}