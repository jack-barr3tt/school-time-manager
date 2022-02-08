import { Settings } from "@mui/icons-material";
import { ButtonBase, Stack, styled, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { MouseEventHandler } from "react";

const HoverButton = styled(ButtonBase)(() => ({
    '&:hover': {
        backgroundColor: grey[100]
    }
}))

type Props = { 
    mainText: string, 
    lowerText: string, 
    onClick?: MouseEventHandler 
}

export default function SettingsButton (props: Props) {
    const { mainText, lowerText, onClick } = props
    return <HoverButton color="inherit" sx={{ p: 2, justifyContent: "flex-start", width: "100%" }} onClick={onClick}>
        <Settings sx={{ mr: 2 }}/>
        <Stack alignItems="flex-start">
            <Typography variant="subtitle1">{mainText}</Typography>
            <Typography variant="subtitle2">{lowerText}</Typography>
        </Stack>
    </HoverButton>
}