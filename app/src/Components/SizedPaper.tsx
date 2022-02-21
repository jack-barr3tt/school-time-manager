import { Paper } from "@mui/material"
import { ReactNode, useEffect, useRef, useState } from "react"
import { ColorIntToString } from "../functions"
import useContainerDimensions from "../Hooks/useContainerDimensions"

type SizedPaperProps = { 
    children: ReactNode, 
    color: number
}

export default function SizedPaper (props: SizedPaperProps) {
    const { children, color } = props
    const ref = useRef<HTMLHeadingElement>(null)
    const { width, height } = useContainerDimensions(ref)
    const [fixedWidth, setFixedWidth] = useState<string>()
    const [fixedHeight, setFixedHeight] = useState<string>()

    useEffect(() => {
        if(width && height) {
            setFixedWidth(`${width}px`)
            setFixedHeight(`${height}px`)
        }
    }, [width, height])

    return <Paper ref={ref} sx={{ width: (fixedWidth || 1), height: (fixedHeight || 1), backgroundColor: ColorIntToString(color), p: 0.75 }}>
        {fixedWidth && fixedHeight && children}
    </Paper>
}