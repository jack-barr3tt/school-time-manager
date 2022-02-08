import { AccessTime, Circle } from '@mui/icons-material';
import { ButtonBase, Paper, Stack, Typography } from '@mui/material';
import { grey, red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import Homework from '../API/Homework';

export default function HomeworkCard (props: { homework: Homework }) {
    const { _id, task, subject, due, difficulty } = props.homework;
    const { name, color } = subject;
    
    const navigate = useNavigate()

    const getMonth = (date: Date) => {
        const months = [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC"
        ]

        return months[date.getMonth()]
    }
    
    const getDifficulty = (difficulty: number) => {
        return ["Easy", "Medium", "Hard"][difficulty];
    }

    const getColor = (color?: number) => {
        if(!color) return grey[500];
        let base = color.toString(16);
        if(base.length < 6) {
            const fill = new Array(6 - base.length).fill("0").join("");
            base = fill + base;
        }
        return base; 
    }

    const truncateText = (text: string) => {
        const limit = 55
        if(text.length < limit) return text
        return text.substring(0, limit).split(" ").slice(0, -1).join(" ") + "..."
    }

    return <ButtonBase onClick={() => navigate(""+_id)} sx={{ borderRadius: 6, boxSizing: "border-box", width: "100%" }}>
        <Paper elevation={4} sx={{ p: 2, borderRadius: 6, width: "100%" }}>
            <Stack direction="column">
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h5" sx={{ my: 2, pr: 2, textAlign: "left" }}>{truncateText(task)}</Typography>
                    {due && <Paper elevation={0} sx={{ height: "96px", aspectRatio: "1", backgroundColor: grey[200], borderRadius: 3 }}>
                        <Paper sx={{ width: "100%", height: "24px", borderRadius: "12px 12px 0 0", backgroundColor: red[500] }} elevation={0}>
                            <Typography variant="body1" sx={{ textAlign: "center", height: "100%" }} color="white">{getMonth(due)}</Typography>
                        </Paper>
                        <Typography variant="body1" sx={{ textAlign: "center", fontSize: "2.5rem", my: "6px" }}>{due.getDate()}</Typography>
                    </Paper>}
                </Stack>
                <Stack direction="row" alignItems="center">
                    <Circle sx={{ color: `#${getColor(color)}`, mr: 1 }} />
                    <Typography variant="body1">{name}</Typography>
                    { difficulty != null && <>
                        <AccessTime sx={{ ml: 3, mr: 1 }}/>
                        <Typography variant="body1">{getDifficulty(difficulty)}</Typography>
                    </>}
                </Stack>
            </Stack>
        </Paper>
    </ButtonBase>   
}
