import { Stack, Typography } from "@mui/material"
import { compareDesc, compareAsc, isPast } from "date-fns"
import { useState, useEffect } from "react"
import Homework from "../../API/Homework"
import HomeworkCard from "../../Components/HomeworkCard"
import { MergeSort } from "../../functions"

type HomeworkByDueProps = {
    homework: Homework[],
    deleteHomework: (hw: Homework) => void,
    completeHomework: (hw: Homework) => void
}

export default function HomeworkByDue(props: HomeworkByDueProps) {
    const { homework, deleteHomework, completeHomework } = props

    const [overdueHomework, setOverdueHomework] = useState<Homework[]>([])
    const [completedHomework, setCompletedHomework] = useState<Homework[]>([])
    const [todoHomework, setTodoHomework] = useState<Homework[]>([])

    useEffect(() => {
        // Sort completed homework by date with the most recently due homework first
        setCompletedHomework(
            MergeSort(
                homework.filter(h => h.complete),
                (a, b) => compareDesc(a.due || 0, b.due || 0)
            )
        )

        // Sort all incomplete homework by due date soonest to latest
        const sortedHomework = MergeSort(
            homework.filter(h => !h.complete), 
            (a, b) => compareAsc(a.due || 0, b.due || 0)
        )

        // All homework due in the past is saved to overdueHomework
        setOverdueHomework(sortedHomework.filter(h => h.due && isPast(h.due) ))
        // All homework due in the future is saved to todoHomework
        // Any homework without a due date is also included in todoHomework
        setTodoHomework([
            ...sortedHomework.filter(h => !isPast(h.due || 0) ),
            ...sortedHomework.filter(h => !h.due)
        ])
    }, [homework])

    return <Stack direction="column" spacing={3} alignItems="center" sx={{ pt: 2 }}>
        { overdueHomework.length > 0 && <>
            <Typography variant="h6" alignSelf="flex-start">Overdue</Typography>
            { overdueHomework.map(hw => 
                <HomeworkCard
                    key={hw._id}
                    homework={hw} 
                    _delete={() => deleteHomework(hw)} 
                    complete={() => completeHomework(hw)} 
                />
            ) }
        </> }
        { todoHomework.length > 0 && <>
            <Typography variant="h6" alignSelf="flex-start">To Do</Typography>
            { todoHomework.map(hw => 
                <HomeworkCard
                    key={hw._id}
                    homework={hw} 
                    _delete={() => deleteHomework(hw)} 
                    complete={() => completeHomework(hw)} 
                />
            ) }
        </> }
        { completedHomework.length > 0 && <>
            <Typography variant="h6" alignSelf="flex-start">Completed</Typography>
            { completedHomework.map(hw =>
                <HomeworkCard
                    key={hw._id}
                    homework={hw}
                    _delete={() => deleteHomework(hw)}
                />
            ) }
        </> }
    </Stack>
}