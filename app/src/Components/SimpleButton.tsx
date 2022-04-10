import { ButtonBase, ButtonBaseProps, Paper, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

type SimpleButtonProps = ButtonBaseProps & {
    onClick: () => void
    icon: ReactNode
    text: string
}

export default function SimpleButton(props: SimpleButtonProps) {
    const { onClick, icon, text, ...rest } = props

    // Simple button in the sampe visual style as cards
    return <ButtonBase 
        sx={{
            borderRadius: 3 
        }}
        onClick={onClick}
        {...rest}
    >
        <Paper sx={{ py: 1, px: 3, borderRadius: 3 }} elevation={3}>
            <Stack direction="row" spacing={1} alignItems="center">
                {icon}
                <Typography variant="h5">{text}</Typography>
            </Stack>
        </Paper>
    </ButtonBase>

}
