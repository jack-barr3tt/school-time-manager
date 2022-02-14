import { AccessTime, Check, Circle, Delete } from '@mui/icons-material';
import { ButtonBase, Paper, Stack, styled, Typography, useTheme } from '@mui/material';
import { grey, red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import SwipeableViews from "react-swipeable-views"
import Homework from '../API/Homework';

type Props = {
    homework: Homework;
    _delete: () => void;
    complete: () => void;
}

export default function HomeworkCard (props: Props) {
    const { _delete, complete } = props;
    const { _id, task, subject, due, difficulty } = props.homework;
    const { name, color } = subject;
    
    const navigate = useNavigate()
    const theme = useTheme()

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

    const displayCardTheme = { borderRadius: 0, width: 1, height: 1, display: "flex", flexDirection: "row", alignItems: "center", px: 2 }
    const completeDisplay = <Paper sx={{ backgroundColor: "success.main", justifyContent: "flex-start", ...displayCardTheme}}>
        <Check sx={{ width: "3rem", height: "3rem"}}/>
    </Paper>

    const deleteDisplay = <Paper sx={{ backgroundColor: "error.main", justifyContent: "flex-end", ...displayCardTheme}}>
        <Delete sx={{ width: "3rem", height: "3rem"}}/>
    </Paper>

    const StyledSwiper = styled(SwipeableViews)({
        borderRadius: +theme.shape.borderRadius * 6,
        boxShadow: theme.shadows[4]
    })

    return <StyledSwiper
                enableMouseEvents
                index={1}
                hysteresis={1}
                onChangeIndex={(index) => {
                    if(index === 0) {
                        _delete()
                    }else if(index === 2) {
                        complete()
                    }
                }}
            >
            {deleteDisplay}
            <ButtonBase onClick={() => navigate(""+_id)} sx={{ borderRadius: 6, boxSizing: "border-box", width: "100%" }}>
            <Paper elevation={0} sx={{ p: 2, width: 1, height: 1 }}>
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
        {completeDisplay}
    </StyledSwiper> 
}
