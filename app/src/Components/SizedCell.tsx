import { styled } from "@mui/material";
import { ReactNode } from "react";

type RelativeCellProps = {
    children: ReactNode,
    height?: string,
    width?: string,
}

export function SizedCell(props: RelativeCellProps) {
    const { children, height, width } = props;

    let Cell = styled("td")({
        height,
        width,
        overflow: "hidden"
    });
    return <Cell>{children}</Cell>;
}
