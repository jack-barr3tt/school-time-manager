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
    // If no color provided, return grey
    if(!color) return grey[500]
    // Convert the color to a hex string
    let base = color.toString(16)
    // If the color is less than 6 characters, pad it with zeros
    if(base.length < 6) {
        const fill = new Array(6 - base.length).fill("0").join("")
        base = fill + base
    }
    return "#" + base 
}

export const RepeatsToWeeks = (repeats: Repeat[]) => {
    const weeks : Repeat[][] = []
    let currentWeek = 0

    // Gets the last day index of a repeat
    const getRepeatEnd = (repeats: Repeat[]) => {
        const lastRepeat =  repeats[repeats.length - 1]
        return lastRepeat.end_day
    }

    const sortedRepeats = MergeSort(
        repeats,
        (a, b) => a.index - b.index
    )

    for(let r of sortedRepeats) {
        if(weeks.length === 0) {
            // Weeks should be a 2D array, so if it's empty, add a new week in an array
            weeks.push([r])
        }else if(getRepeatEnd(weeks[currentWeek]) < r.start_day) {
            /*
            If the end of the current week is before the start of the next repeat we are considering,
            there must be space to add this repeat to the current week.
            */
            weeks[currentWeek].push(r)
        }else{
            // If we have got this far, the current week is full, so we need to add a new week
            weeks.push([r])
            currentWeek++
        }
    }

    return weeks
}

export const MinutesToHrsMins = (minutes: number) => {
    const mins = minutes % 60
    const hrs = Math.floor(minutes / 60)

    let text = ""
    if(hrs > 0) text += `${hrs} hour`
    if(hrs > 1) text += "s"
    if(mins > 0) text += ` ${mins} min`
    if(mins > 1) text += "s"

    return text
}

export const TransposeLessonBlock = (time: LessonBlock, source?: Date) => {
    const addTime = (time: number) => add(startOfDay(source || Date.now()), intervalToDuration({ start: 0, end: time }))

    return {
        ...time,
        // Replace the start and end times with times relative to the source date
        start_time: addTime(
            // The difference between the repeat start time and the start of the day
            time.start_time.getTime() - startOfDay(time.start_time).getTime()
            ),
        end_time: addTime(
            // The difference between the repeat end time and the start of the day
            time.end_time.getTime() - startOfDay(time.end_time).getTime()
            )
    }
}

function Merge<T>(left: T[], right: T[], compare: (a: T, b: T) => number) {
    const result: T[] = []
    let l = 0
    let r = 0

    // Repeat while left and right pointers are not at the end of the arrays
    while(l < left.length && r < right.length) {
        if(compare(left[l], right[r]) <= 0) {
            // If left element should come first, add it to the result
            result.push(left[l])
            // Increment left pointer
            l++
        }else{
            // If right element should come first, add it to the result
            result.push(right[r])
            // Increment right pointer
            r++
        }
    }
    
    // Return the result plus an elements from left and right array that are left over
    return [...result, ...left.slice(l), ...right.slice(r)]
}

export function MergeSort<T>(array: T[], compare: (a: T, b: T) => number) : T[] {
    // If array is empty or has only one element, there's no point in sorting it
    if(array.length <= 1) return array
    
    // Pivot will be the middle element of the array
    const pivot = Math.floor(array.length / 2)
    // Left array contains elements up to but not including the pivot
    const left = array.slice(0, pivot)
    // Right array contains elements from the pivot and onwards
    const right = array.slice(pivot)
    
    // Recursively sort and merge the left and right arrays
    return Merge(
        MergeSort(left, compare), 
        MergeSort(right, compare), 
        compare
    )
}