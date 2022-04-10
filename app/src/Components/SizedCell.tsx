import { styled } from "@mui/material";
import { ReactNode } from "react";

type RelativeCellProps = {
    children: ReactNode,
    height?: string,
    width?: string,
}

export function SizedCell(props: RelativeCellProps) {
    const { children, height, width } = props

    // Creates a styled td components that has a height and width defined by the props
    const Cell = styled("td")({
        height,
        width,
        overflow: "hidden"
    })
    return <Cell>{children}</Cell>
}
