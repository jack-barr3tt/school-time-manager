import { IconButton, Paper, Stack, Typography, useTheme } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';

type Props = {
    name: string
    backDisabled?: boolean
    onBack?: () => void
    controls?: ReactNode[]
}

export default function NavBar (props: Props) {
    const { name, backDisabled, onBack, controls } = props
    const navigate = useNavigate()
    const location = useLocation()
    const theme = useTheme()

    const navigateBack = () => {
        navigate("/" + location.pathname.split("/").filter(x => x.length > 0).slice(0, -1).join("/"))
    }

    return <>
        <Paper 
            // Display the gradient first seen on home screen for continuity
            sx={{ 
                zIndex: 10, 
                backgroundImage: `linear-gradient(${theme.palette.secondary.main}, ${theme.palette.background.default})`, 
                p: 3, 
                width: 1, 
                position: "absolute", 
                left: 0, 
                top: 0 
            }} 
            elevation={0}
        />

        <Paper elevation={0} sx={{ zIndex: 11, position: "absolute", top: 7, left: 0, width: 1, p: 2, backgroundColor: grey[50], borderRadius: 4, minHeight: "72px" }}>
            { controls ?
                // If the navbar needs to contain controls, split them into two stacks which are displayed on the left and right
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ height: "40px" }}>
                    <Stack direction="row" alignItems="center" sx={{ height: "40px" }}>
                        {
                            // If back is not disabled, add a back button
                            !backDisabled && 
                                <IconButton aria-label="back" sx={{ mr: 2 }} onClick={onBack || navigateBack}>
                                    <ArrowBack/>
                                </IconButton>
                        }
                        <Typography variant="h5" sx={ backDisabled ? { pl: 7 } : {} }>{name}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                        {controls}
                    </Stack>
                </Stack>
            : <Stack direction="row" alignItems="center" sx={{ height: "40px" }}>
                { 
                    // If back is not disabled, add a back button
                    !backDisabled && 
                        <IconButton aria-label="back" sx={{ mr: 2 }} onClick={onBack || navigateBack}>
                            <ArrowBack/>
                        </IconButton>
                }
                <Typography variant="h5" sx={ backDisabled ? { pl: 7 } : {} }>{name}</Typography>
            </Stack>
            }
        </Paper>
        <Paper elevation={0} sx={{ p: 5 }}/>
    </>
}
