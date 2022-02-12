import { Edit, Delete } from '@mui/icons-material'
import { ButtonBase, IconButton, Paper, Stack, Typography } from '@mui/material'

type Props = {
    id: number;
    topText: string;
    bottomText: string;
    deleteItem: (id: number) => void;
    setEditingId: (id: number) => void;
    setEditing: (editing: boolean) => void;
}

export default function SetupCard(props: Props) {
    const { id, topText, bottomText, deleteItem, setEditingId, setEditing } = props

    return <Paper sx={{ width: 1 }}>
        <Stack direction="row">
            <ButtonBase sx={{ width: 1, height: 1, p: 2 }}>
                <Stack direction="column" alignItems="left" sx={{ width: 1 }}>
                    <Typography variant="h6" sx={{ textAlign: "left" }}>{topText}</Typography>
                    <Typography variant="body1" sx={{ textAlign: "left" }}>{bottomText}</Typography>
                </Stack>
            </ButtonBase>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2 }}>
                <IconButton onClick={() => { setEditingId(id); setEditing(true); }} id={""+id}>
                    <Edit/>
                </IconButton>
                <IconButton onClick={() => deleteItem(id)} id={""+id}>
                    <Delete/>
                </IconButton>
            </Stack>
        </Stack>
    </Paper>
}
