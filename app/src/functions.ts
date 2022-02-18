import { grey } from "@mui/material/colors";

export const DayIndexToString = (index: number, size: ("short"|"long") = "short") => 
    size === "short" ? 
        ["MON","TUE","WED","THU","FRI","SAT","SUN"][index]
    :
        ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][index]

export const ColorIntToString = (color?: number) => {
    if(!color) return grey[500];
    let base = color.toString(16);
    if(base.length < 6) {
        const fill = new Array(6 - base.length).fill("0").join("");
        base = fill + base;
    }
    return "#"+base; 
}