import { AssignmentList } from "./AssignmentList";
import { Bin } from "./Bin";
import { DurationOfActivities, DurationLength, ActivityData, Duration } from "./DurationHelpers";

export function AssignActivitiesToBlock(times: Duration[], activities: ActivityData[]) {
    const toAssign = new AssignmentList<ActivityData>(activities)

    const newActivities : ActivityData[] = []
    
    for(const time of times) {
        const thisBlock : ActivityData[] = []

        toAssign.rewind()
        
        while(true) {
            const next = toAssign.next()
            if(!next) break
    
            if(DurationOfActivities([...thisBlock, next]) > DurationLength(time)) break
            thisBlock.push(next)
        }

        newActivities.push(
            ...thisBlock.map(a => ({
                    ...a,
                    id: a.id,
                    working_time_id: time.id
                })
            )
        )
    }

    return newActivities
}

export function AssignActivitiesToShortBlocks(times: Duration[], activities: ActivityData[]) {
    const newActivities : ActivityData[] = []
    const sortedActivities = activities.sort((a, b) => a.duration - b.duration)

    for(const time of times) {
        const blockDuration = DurationLength(time)

        const sameDuration = sortedActivities.find(a => a.duration == blockDuration)
        
        if(sameDuration) {
            newActivities.push({
                ...sameDuration,
                working_time_id: time.id
            })
            continue
        }

        const bin = new Bin<ActivityData>(blockDuration)

        let i = 0
        while(true) {
            try {
                bin.add(sortedActivities[i])
                i++
            }catch{
                break
            }
        }

        const wastedTime = blockDuration - bin.getSpaceUsed()
        if(wastedTime > 20) {
            //split up an activitiy into wastedTime length
                //delete activity
                //create activity of length wastedTime
                //create activity of length (activity length - wastedTime)
        }
    }

    return newActivities
}