import { Edit, Delete } from '@mui/icons-material'
import { ButtonBase, Container, IconButton, Paper, Stack, Typography } from '@mui/material'

type Props = {
    id: number
    topText?: string
    bottomText?: string
    clickable?: boolean
    deleteItem: (id: number) => void
    setEditingId: (id: number) => void
    setEditing: (editing: boolean) => void
}

export default function SetupCard(props: Props) {
    const { id, topText, bottomText, clickable, deleteItem, setEditingId, setEditing } = props

    const infoReadout = <Stack direction="column" alignItems="left" sx={{ width: 1 }}>
        { topText && <Typography variant="h6" sx={{ textAlign: "left" }}>{topText}</Typography> }
        { bottomText && <Typography sx={{ textAlign: "left" }}>{bottomText}</Typography> }
    </Stack>

    const infoContainerStyle = { width: 1, height: 1, p: 2 }

    return <Paper sx={{ width: 1 }}>
        <Stack direction="row">
            { clickable ? 
                // The button only covers the text area, so that the icon buttons can be clicked
                <ButtonBase sx={infoContainerStyle} >
                    {infoReadout}
                </ButtonBase>
                : 
                <Container sx={infoContainerStyle}>
                    {infoReadout}
                </Container>
            }
            <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2 }}>
                <IconButton 
                    onClick={() => { 
                        setEditingId(id) 
                        setEditing(true) 
                    }} 
                    id={""+id}
                >
                    <Edit/>
                </IconButton>
                <IconButton onClick={() => deleteItem(id)} id={""+id}>
                    <Delete/>
                </IconButton>
            </Stack>
        </Stack>
    </Paper>
}
