import { Settings } from "@mui/icons-material";
import { ButtonBase, Stack, styled, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { FC, MouseEventHandler } from "react";

const HoverButton = styled(ButtonBase)(() => ({
    '&:hover': {
        backgroundColor: grey[100]
    }
}))

export const SettingsButton : FC<{ mainText: string, lowerText: string, onClick?: MouseEventHandler }> = ({ mainText, lowerText, onClick }) => {
    return <HoverButton color="inherit" sx={{ p: 2, justifyContent: "flex-start", width: "100%" }} onClick={onClick}>
        <Settings sx={{ mr: 2 }}/>
        <Stack alignItems="flex-start">
            <Typography variant="subtitle1">{mainText}</Typography>
            <Typography variant="subtitle2">{lowerText}</Typography>
        </Stack>
    </HoverButton>
}