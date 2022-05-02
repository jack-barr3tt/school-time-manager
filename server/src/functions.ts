import { add, startOfDay, intervalToDuration, differenceInWeeks, startOfWeek } from "date-fns"
import { Lesson } from "./database/lesson"
import type { LessonBlock } from "./database/lesson_block"
import { Repeat } from "./database/repeats"

export const TransposeLessonBlock = (time: LessonBlock, source?: Date) => {
    const addTime = (time: number) => add(startOfDay(source || Date.now()), intervalToDuration({ start: 0, end: time }))

    return {
        ...time,
        id: time.id,
        // Replace the start and end times with times relative to the source date
        start_time: addTime(
            // The difference between the repeat start time and the start of the day
            time.start_time - startOfDay(time.start_time).getTime()
            ),
        end_time: addTime(
            // The difference between the repeat end time and the start of the day
            time.end_time - startOfDay(time.end_time).getTime()
            )
    }
}

export function RepeatsToWeeks (repeats: Repeat[]) {
    const weeks : Repeat[][] = []
    let currentWeek = 0

    // Gets the last day index of a repeat
    const getRepeatEnd = (repeats: Repeat[]) => 
        repeats.reduce((a, b) => a > b.end_day ? a : b.end_day, 0)
    
    const sortedRepeats = MergeSort(repeats, (a, b) => a.index - b.index)

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

export function LessonsInWeeks (allLessons: Lesson[], weeks: Repeat[][]) {
    return weeks.map(w => 
        w.map(r => 
            allLessons.filter(l => l.repeat_id === r.id)
        )
    )
}

export function GetWeek (weeks: Lesson[][][], repeatRef: Date, repeatId: number) {
    // How many weeks have elapsed since the reference date
    const weeksSinceRef = differenceInWeeks(
        startOfWeek(repeatRef),
        startOfWeek(new Date())
    )
    // Which week was the reference date recorded in
    const weekNo = weeks.findIndex(w => w.some(r => r[0].repeat_id == repeatId))

    if(weeksSinceRef === 0) {
        // The reference was made this week so we return this weeks lessons
        return {
            lessons: weeks[weekNo].flat(1),
            no: weekNo
        }
    }else{
        /* 
        The week we want is going to be some number of weeks after the reference date,
        but because there is a limited number of weeks, we take a modulus of the number of weeks
        to represent the fact that weeks are circular.
        */
        const index = (weeksSinceRef + weekNo) % weeks.length
        return {
            lessons: weeks[index].flat(1),
            no: index
        }
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