import { AccessTime, Check, Delete } from '@mui/icons-material';
import { Paper, styled, Typography, useTheme } from '@mui/material';
import { red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import SwipeableViews from "react-swipeable-views"
import Homework from '../API/Homework';
import { DateToMonth, MinutesToHrsMins } from '../functions';
import { Card } from './Card';

type Props = {
    homework: Homework;
    _delete: () => void;
    complete: () => void;
}

export default function HomeworkCard (props: Props) {
    const { _delete, complete } = props;
    const { _id, task, subject, due, duration } = props.homework;
    const { name, color } = subject;
    
    const navigate = useNavigate()
    const theme = useTheme()

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
        boxShadow: theme.shadows[4],
        width: "100%"
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
            <Card
                mainText={truncateText(task)}
                calendarProps={ due && {
                    topText: DateToMonth(due),
                    bottomText: [""+due.getDate()],
                    accentColor: red[500]
                }}
                onClick={() => navigate(""+_id)}
                subText={name}
                circleColor={color}
                footerComponents={ duration != null ? [
                    <AccessTime sx={{ ml: 3, mr: 1 }}/>,
                    <Typography variant="body1">{MinutesToHrsMins(duration)}</Typography>
                ] : []}
            />
        {completeDisplay}
    </StyledSwiper> 
}
