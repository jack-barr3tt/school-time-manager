import { ButtonBase, Paper } from "@mui/material"
import { ReactNode, useEffect, useRef, useState } from "react"
import { ColorIntToString } from "../functions"
import useContainerDimensions from "../Hooks/useContainerDimensions"

type SizedPaperProps = { 
    children: ReactNode;
    color: number;
    onClick?: () => void;
}

export default function SizedPaper (props: SizedPaperProps) {
    const { children, color, onClick } = props
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

    var childrenToUse
    if(onClick)
        childrenToUse = <ButtonBase onClick={onClick} sx={{ width: fixedWidth || 1, height: fixedHeight || 1, p: 0.75, flexDirection: "column", justifyContent: "flex-start", borderRadius: 1 }}>{children}</ButtonBase>
    else
        childrenToUse = children

    return <Paper ref={ref} sx={{ width: (fixedWidth || 1), height: (fixedHeight || 1), backgroundColor: ColorIntToString(color), p: (!!onClick ? 0 : 0.75) }}>
        {fixedWidth && fixedHeight && childrenToUse}
    </Paper>
}