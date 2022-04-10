import { AccessTime, Check, Delete } from '@mui/icons-material';
import { Paper, styled, Typography, useTheme } from '@mui/material';
import { red } from '@mui/material/colors';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import SwipeableViews from "react-swipeable-views"
import Homework from '../API/Homework';
import { DateToMonth, MinutesToHrsMins } from '../functions';
import { Card } from './Card';

type Props = {
    homework: Homework
    _delete?: () => void
    complete?: () => void
}

export default function HomeworkCard (props: Props) {
    const { _delete, complete } = props
    const { _id, task, subject, due, duration } = props.homework
    const { name, color } = subject
    
    const navigate = useNavigate()
    const theme = useTheme()

    const truncateText = (text: string) => {
        const limit = 55 // Text over 55 characters tends to overwhelm the screen
        if(text.length < limit) return text
        return text.substring(0, limit).split(" ").slice(0, -1).join(" ") + "..."
    }

    const displayCardTheme = { borderRadius: 0, width: 1, height: 1, display: "flex", flexDirection: "row", alignItems: "center", px: 2 }

    const CardDisplay = (props: { swiper?: boolean }) => <Card
        mainText={truncateText(task)}
        calendarProps={ due && {
            topText: DateToMonth(due),
            bottomText: [""+due.getDate()],
            accentColor: red[500]
        }}
        onClick={() => navigate(""+_id)}
        subText={name}
        circleColor={color}
        fullHeight
        disableShadow={props.swiper}
        footerComponents={ duration != null ? [
            <AccessTime sx={{ ml: 3, mr: 1 }}/>,
            <Typography>{MinutesToHrsMins(duration)}</Typography>
        ] : []}
    />

    if(!(_delete || complete))
        // If no actions have been defined, we just render the item as a normal card
        return <CardDisplay/>
    else {
        // Otherwise We need to set up the swiper

        // Define a component for the complete swiper
        const completeDisplay = <Paper sx={{ backgroundColor: "success.main", justifyContent: "flex-start", ...displayCardTheme}}>
            <Check sx={{ width: "3rem", height: "3rem", color: "white"}}/>
        </Paper>

        // Define a component for the delete swiper
        const deleteDisplay = <Paper sx={{ backgroundColor: "error.main", justifyContent: "flex-end", ...displayCardTheme}}>
            <Delete sx={{ width: "3rem", height: "3rem", color: "white" }}/>
        </Paper>

        // The swiper should have the same style as a card
        const StyledSwiper = styled(SwipeableViews)({
            borderRadius: +theme.shape.borderRadius * 6,
            boxShadow: theme.shadows[4],
            width: "100%"
        })

        const Swiper = (props: { children: ReactNode }) => {
            // Add the views in a certain order so that the delete swiper is always on the left, the card is central and the complete swiper is on the right
            const children = []
            let indexOfDelete = -1
            let indexOfComplete = -1

            if(_delete) {
                indexOfDelete = children.length
                children.push(deleteDisplay)
            }

            const indexOfCard = children.length
            children.push(props.children)

            if(complete) {
                indexOfComplete = children.length
                children.push(completeDisplay)
            }

            console.log(indexOfDelete, indexOfCard, indexOfComplete)
            
            return <StyledSwiper
                enableMouseEvents
                index={indexOfCard} // Initially we want to display the homework card
                hysteresis={1}
                onChangeIndex={(index) => {
                    // Check if the swiper has moved to either of the actions, and if so call their respective functions
                    if(index === indexOfDelete && _delete) {
                        _delete()
                    }else if(index === indexOfComplete && complete) {
                        complete()
                    }
                }}
            >
                {children}
            </StyledSwiper> 
        }

        return <Swiper>
            <CardDisplay swiper/>
        </Swiper>
    }
}
