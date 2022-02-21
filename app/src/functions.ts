import { grey } from "@mui/material/colors";
import Repeat from "./API/Repeat";

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

export const RepeatsToWeeks = (repeats: Repeat[]) => {
    let weeks : (Repeat[])[] = []
    let currentWeek = 0

    const getRepeatEnd = (repeats: Repeat[]) => {
        let lastRepeat =  repeats[repeats.length - 1]
        return lastRepeat.end_day
    }

    for(let r of repeats.sort((a, b) => a.index - b.index)) {
        if(weeks.length === 0) {
            weeks.push([r])
        }else if(getRepeatEnd(weeks[currentWeek]) < r.start_day) {
            weeks[currentWeek] = [...weeks[currentWeek], r]
        }else{
            weeks.push([r])
            currentWeek++
        }
    }

    return weeks
}