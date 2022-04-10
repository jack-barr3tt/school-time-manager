import { Paper, Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { ColorIntToString } from '../functions';

export type CalendarProps = { 
    topText: string
    bottomText: string[]
    accentColor: string|number
}

// Create a square calendar-like component for displaying data
export default function Calendar(props: CalendarProps) {
    const { topText, bottomText, accentColor } = props

    const accentColorToUse = typeof accentColor === 'string' ? accentColor : ColorIntToString(accentColor) // Convert to string if number

    return <Paper elevation={0} sx={{ height: "96px", aspectRatio: "1", backgroundColor: grey[200], borderRadius: 3 }}>
        <Paper sx={{ width: 1, height: "24px", borderRadius: "12px 12px 0 0", backgroundColor: accentColorToUse }} elevation={0}>
            <Typography 
                sx={{ 
                    textAlign: "center", 
                    px: 1, height: "24px", 
                    width:"96px",
                    textOverflow: "ellipsis", 
                    overflow: "hidden", 
                    whiteSpace: "nowrap",
                    color: "white"
                }}
            >
                {topText}
            </Typography>
        </Paper>
        { bottomText.length < 2 ?
            <Typography sx={{ textAlign: "center", fontSize: "2.5rem", my: "6px" }}>{bottomText[0]}</Typography>
            :
            <Stack direction="column" alignItems="center">
                {
                    bottomText.map(t =>
                        <Typography>{t}</Typography>
                    )
                }
            </Stack>
        }
    </Paper>
}
