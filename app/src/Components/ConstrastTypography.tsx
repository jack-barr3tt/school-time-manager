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
        return theme.palette.getContrastText(background) // Use the contrast ratio to get an appropriate text color
    }catch{
        return theme.palette.text.primary // If the background is not a valid color, use the default text color from the theme
    }
}

export default function ContrastTypography(props: Props) {
    const { backgroundColor, ...rest } = props
    const backgroundString = typeof backgroundColor === "number" ? ColorIntToString(backgroundColor) : backgroundColor // Convert to string if number

    // Create a typography component that uses the appropriate text color based on the background color
    const Contrasted = styled(Typography)({
        color: ContrastFromBackground(backgroundString)
    })

    return <Contrasted {...rest} /> // All other props are passed to styled typography component so it behaves the same
}