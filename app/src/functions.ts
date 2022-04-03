import { grey } from "@mui/material/colors";
import { add, startOfDay, intervalToDuration } from "date-fns";
import LessonBlock from "./API/LessonBlock";
import Repeat from "./API/Repeat";

export const DayIndexToString = (index: number, size: ("short"|"long") = "short") => 
    size === "short" ? 
        ["MON","TUE","WED","THU","FRI","SAT","SUN"][index]
    :
        ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][index]


export const DateToMonth = (date: Date) => [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
    ][date.getMonth()]

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

    const sortedRepeats = MergeSort(
        repeats,
        (a, b) => a.index - b.index
    )

    for(let r of sortedRepeats) {
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

export const MinutesToHrsMins = (minutes: number) => {
    const mins = minutes % 60
    const hrs = Math.floor(minutes / 60)
    const display = (text: string, show: boolean) => show ? `${text}` : ""
    return `${display(`${hrs} hour${display("s", hrs > 1)}`, hrs > 0)} ${display(`${mins} mins`,mins !== 0)}`
}

export const TransposeLessonBlock = (time: LessonBlock, source?: Date) => ({
    ...time,
    start_time: add(startOfDay(source || Date.now()), intervalToDuration({ start: 0, end: (time.start_time.getTime() - startOfDay(time.start_time).getTime()) })),
    end_time: add(startOfDay(source || Date.now()), intervalToDuration({ start: 0, end: (time.end_time.getTime() - startOfDay(time.end_time).getTime()) }))
})

function Merge<T>(left: T[], right: T[], compare: (a: T, b: T) => number) {
    const result: T[] = []
    let l = 0
    let r = 0

    while(l < left.length && r < right.length) {
        if(compare(left[l], right[r]) <= 0) {
            result.push(left[l])
            l++
        }else{
            result.push(right[r])
            r++
        }
    }
    
    return [...result, ...left.slice(l), ...right.slice(r)]
}

export function MergeSort<T>(array: T[], compare: (a: T, b: T) => number) : T[] {
    if(array.length < 2) return array;
    
    const pivot = Math.floor(array.length / 2);
    const left = array.slice(0, pivot);
    const right = array.slice(pivot);
    
    return Merge(MergeSort(left, compare), MergeSort(right, compare), compare);
}