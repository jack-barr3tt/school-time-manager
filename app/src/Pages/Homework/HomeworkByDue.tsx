import { Stack, Typography } from "@mui/material"
import { compareDesc, compareAsc, isPast } from "date-fns"
import { useState, useEffect } from "react"
import Homework from "../../API/Homework"
import HomeworkCard from "../../Components/HomeworkCard"

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
        setCompletedHomework(
            homework
            .sort((a, b) => compareDesc(a.due || 0, b.due || 0))
            .filter(h => h.complete)
        )
        const sortedHomework = homework.sort((a, b) => compareAsc(a.due || 0, b.due || 0))
        const incompleteHomework = sortedHomework.filter(h => !h.complete)
        setOverdueHomework(incompleteHomework.filter(h => isPast(h.due || 0) ))
        setTodoHomework(incompleteHomework.filter(h => !isPast(h.due || 0) ))
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