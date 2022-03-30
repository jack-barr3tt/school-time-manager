import { Paper, Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'

export type CalendarProps = { 
    topText: string;
    bottomText: string[];
    accentColor: string 
}

export default function Calendar(props: CalendarProps) {
    const { topText, bottomText, accentColor } = props
    return <Paper elevation={0} sx={{ height: "96px", aspectRatio: "1", backgroundColor: grey[200], borderRadius: 3 }}>
        <Paper sx={{ width: "100%", height: "24px", borderRadius: "12px 12px 0 0", backgroundColor: accentColor }} elevation={0}>
            <Typography variant="body1" sx={{ textAlign: "center", height: "100%" }} color="white">{topText}</Typography>
        </Paper>
        { bottomText.length < 2 ?
            <Typography variant="body1" sx={{ textAlign: "center", fontSize: "2.5rem", my: "6px" }}>{bottomText[0]}</Typography>
            :
            <Stack direction="column" alignItems="center">
                {
                    bottomText.map(t =>
                        <Typography variant="body1">{t}</Typography>
                    )
                }
            </Stack>
        }
    </Paper>
}
