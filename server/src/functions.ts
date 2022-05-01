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

export const RepeatsToWeeks = (repeats: Repeat[]) => {
    const weeks : Repeat[][] = []
    let currentWeek = 0

    // Gets the last day index of a repeat
    const getRepeatEnd = (repeats: Repeat[]) => {
        const lastRepeat =  repeats[repeats.length - 1]
        return lastRepeat.end_day
    }

    const sortedRepeats = repeats.sort((a, b) => a.index - b.index)

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

export const LessonsInWeeks = (allLessons: Lesson[], weeks: Repeat[][]) => {
    return weeks.map(w => 
        w.map(r => 
            allLessons.filter(l => l.repeat_id === r.id)
        )
    )
}

export const GetWeek = (weeks: Lesson[][][], repeatRef: Date, repeatId: number) => {
    const weeksSinceRef = differenceInWeeks(
        startOfWeek(repeatRef),
        startOfWeek(new Date())
    )
    const weekNo = weeks.findIndex(w => w.some(r => r[0].repeat_id == repeatId))
    if(weeksSinceRef === 0) {
        return {
            lessons: weeks[weekNo].flat(1),
            no: weekNo
        }
    }else{
        const index = (weeksSinceRef + weekNo) % weeks.length
        return {
            lessons: weeks[index].flat(1),
            no: index
        }
    }
}