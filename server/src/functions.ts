import { add, startOfDay, intervalToDuration } from "date-fns"
import type { LessonBlock } from "./database/lesson_block"

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