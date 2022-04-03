import { differenceInMinutes } from "date-fns";

export type Duration = {
    id?: number,
    start_time: Date|number,
    end_time: Date|number
}

export type ActivityData = { id?: number, duration: number, working_time_id?: number }

export function DurationOfActivities(activities: ActivityData[]) {
    return activities.reduce((a, b) => a + b.duration, 0)
}

export function DurationLength<T extends Duration>(duration: T) {
    return differenceInMinutes(duration.end_time, duration.start_time)
}

export function DurationSum<T extends Duration>(durations: T[]) {
    return durations.reduce((a,b) => a + DurationLength(b), 0)
}

export function DurationToBlocks(duration: number) : number[] {
    if(duration % 30 === 0) {
        return Array(Math.floor(duration / 30)).fill(30) 
    }
    return [
        ...Array(Math.floor(duration / 30)).fill(30),
        duration % 30 === 0 ? 30 : duration % 30
    ]
}