import { Circle } from '@mui/icons-material';
import { ButtonBase, Paper, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { ColorIntToString } from '../functions';
import Calendar, { CalendarProps } from './Calendar';

type CardProps = {
    mainText: string;
    onClick: () => void;
    calendarProps?: CalendarProps;
    subText?: string;
    circleColor?: number
    footerComponents?: ReactNode[]
}

export function Card(props: CardProps) {
    const { calendarProps, mainText, onClick, subText, circleColor, footerComponents } = props

    return <ButtonBase
        sx={{ borderRadius: 6, width: 1, minHeight: "128px" }}
        onClick={onClick}
    >
        <Paper sx={{ p: 2, borderRadius: 6, width: 1, height: "100%" }} elevation={3}>
            <Stack direction="row" alignItems="center" height="100%" justifyContent="space-between">
                <Typography variant="h5" textAlign="left" sx={{ py: 2 }}>{mainText}</Typography>
                { calendarProps && <Calendar {...calendarProps}/> }
            </Stack>
            <Stack direction="row" alignItems="center">
                { circleColor && <Circle sx={{ color: ColorIntToString(circleColor), mr: 1 }} /> }
                <Typography variant="body1">{subText}</Typography>
                { footerComponents }
            </Stack>
        </Paper>
    </ButtonBase>;
}
