import { styled, Typography, TypographyProps, useTheme } from "@mui/material"
import { ReactNode } from "react"
import { ColorIntToString } from "../functions"

type Props = TypographyProps & {
    backgroundColor: string|number,
    children: ReactNode,
}

function ContrastFromBackground(background: string) {
    const theme = useTheme()

    try{
        return theme.palette.getContrastText(background)
    }catch{
        return theme.palette.text.primary
    }
}

export default function ContrastTypography(props: Props) {
    const { backgroundColor, ...rest } = props
    const backgroundString = typeof backgroundColor === "number" ? ColorIntToString(backgroundColor) : backgroundColor

    let Contrasted = styled(Typography)({
        color: ContrastFromBackground(backgroundString)
    })

    return <Contrasted {...rest} />
}