import { IconButton, Paper, Stack, Typography, useTheme } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';

type Props = {
    name: string;
    onBack?: () => void
    controls?: ReactNode[];
}

export default function NavBar (props: Props) {
    const { name, onBack, controls } = props
    const navigate = useNavigate()
    const location = useLocation()
    const theme = useTheme()

    const navigateBack = () => {
        navigate("/" + location.pathname.split("/").filter(x => x.length > 1).slice(0, -1).join("/"))
    }

    return <>
        <Paper sx={{ zIndex: 10, backgroundImage: `linear-gradient(${theme.palette.secondary.main}, ${theme.palette.background.default})`, p: 3, width: "100%", position: "absolute", left: 0, top: 0 }} elevation={0}/>
        <Paper elevation={0} sx={{ zIndex: 11, position: "absolute", top: 7, left: 0, width: "100%", p: 2, backgroundColor: grey[50], borderRadius: 4 }}>
            { controls ?
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center">
                        <IconButton aria-label="back" sx={{ mr: 2 }} onClick={onBack || navigateBack}>
                            <ArrowBack/>
                        </IconButton>                
                        <Typography variant="h5">{name}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                        {controls}
                    </Stack>
                </Stack>
            : <Stack direction="row" alignItems="center">
                <IconButton aria-label="back" sx={{ mr: 2 }} onClick={onBack || navigateBack}>
                    <ArrowBack/>
                </IconButton>
                <Typography variant="h5">{name}</Typography>
            </Stack>
            }
        </Paper>
        <Paper elevation={0} sx={{ p: 5 }}/>
    </>
}
