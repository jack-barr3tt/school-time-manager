import { Add } from "@mui/icons-material"
import { ButtonBase, CircularProgress, Paper, Stack, styled, Typography } from "@mui/material"
import { addDays, compareAsc, differenceInMinutes, format, isSameDay, isSameMinute, startOfWeek } from "date-fns"
import { useCallback, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Lesson from "../API/Lesson"
import LessonBlock from "../API/LessonBlock"
import { User } from "../API/Users"
import { userContext } from "../App"
import { DayIndexToString, MergeSort } from "../functions"
import { useWeek } from "../Hooks/useWeek"
import ContrastTypography from "./ConstrastTypography"
import { SizedCell } from "./SizedCell"
import SizedPaper from "./SizedPaper"

type TimetableRange = {
    start_day: number;
    end_day: number;
}

type DateRowProps = {
    dayCount: number;
}

type TimetableViewProps = {
    creating: boolean,
    editView: boolean,
    edit: (block: LessonBlock, day: number) => void
}

type FillerProps = {
    addable: boolean,
    editView: boolean,
    clicked: () => void
}

type LessonCardProps = {
    lesson: Lesson;
    onClick: () => void;
}

type LessonGridProps = {
    editView: boolean,
    range: TimetableRange,
    LessonBlocks: LessonBlock[],
    Lessons: Lesson[],
    edit: (block: LessonBlock, day: number) => void
}

function DateRow(props: DateRowProps) {
    const { dayCount } = props
    
    const HeaderRow = styled("thead")({
        height: '10%'
    })

    return <HeaderRow>
        <tr>
            <td/>
            { 
                Array(dayCount).fill(0).map((_, i) => {
                    let thisDay = addDays(startOfWeek(new Date(), {weekStartsOn: 1}), i)
                    let sameDay = isSameDay(new Date(), thisDay)
                    let circleColor = sameDay ? "primary.main" : "background.default"
                    
                    return <SizedCell key={i} width={`${90 / dayCount}%`}>
                        <Stack direction="column" alignItems="center" spacing={0.75}>
                            <Paper elevation={0} sx={{ borderRadius: "50%", width: "2.5rem", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: circleColor }}>
                                <ContrastTypography backgroundColor={circleColor} variant="h6">{format(thisDay, "d")}</ContrastTypography>
                            </Paper>
                            <ContrastTypography backgroundColor={circleColor} variant="body1">{DayIndexToString(i)}</ContrastTypography>
                        </Stack>
                    </SizedCell>
                })
            }
        </tr>
    </HeaderRow>
}

type LessonBlockOrFiller = { 
    _id?: number, 
    name: string, 
    start_time: Date, 
    end_time: Date, 
    filler?: boolean
}

const getBlocksWithFillers = (blocks: LessonBlock[]) => {
    let temp: LessonBlockOrFiller[] = []
    for(let block of blocks) {
        if(temp.length === 0) {
            temp.push(block)
            continue
        }
        if(!isSameMinute(block.start_time, temp[temp.length - 1].end_time)) {
            temp.push({
                name: "",
                start_time: temp[temp.length - 1].end_time,
                end_time: block.start_time,
                filler: true
            })
        }
        temp.push(block)
    }
    return temp
}

function getDayLength (day: LessonBlock[]) {
    const sortedBlocks = MergeSort(
        day, 
        (a, b) => compareAsc(a.start_time, b.start_time)
    )

    return differenceInMinutes(sortedBlocks[sortedBlocks.length - 1].end_time, sortedBlocks[0].start_time)
}

function Filler(props: FillerProps) {
    const { addable, editView, clicked } = props

    if(editView && addable) {
        return  <ButtonBase 
            sx={{ width: 1, height: 1 }}
            onClick={clicked}
        >
            <Paper sx={{ width: 1, height: 1, display: "flex", alignItems:"center", justifyContent:"center" }}>
                <Add/>
            </Paper>
        </ButtonBase>
    } else {
        return <></>
    }
}

function LessonCard(props: LessonCardProps) {
    const { lesson, onClick } = props

    return <SizedPaper color={lesson.subject.color} onClick={onClick}>
            <ContrastTypography backgroundColor={lesson.subject.color} variant="subtitle1" sx={{ width: 1, textAlign: "left", fontWeight: "bold", wordWrap: "break-word", wordBreak: "break-all", lineHeight: "1.25rem" }}>{lesson.subject.name}</ContrastTypography>
            <ContrastTypography backgroundColor={lesson.subject.color} variant="body2" sx={{ width: 1, textAlign: "left", textOverflow: "ellipsis", lineHeight: "1.25rem" }}>{lesson.location.name}</ContrastTypography> 
    </SizedPaper>
}

function LessonGrid(props: LessonGridProps) {
    const { Lessons, LessonBlocks, range, editView, edit } = props

    const navigate = useNavigate()

    const [blocksWithFillers, setBlocksWithFillers] = useState<LessonBlockOrFiller[]>()

    useEffect(() => {
        setBlocksWithFillers(getBlocksWithFillers(LessonBlocks))
    }, [LessonBlocks])

    return <tbody>
        {
            blocksWithFillers && blocksWithFillers.map((b, blockI) => 
                <tr key={b._id || `f-${blockI}`}>
                    <td>
                        <Typography variant="body1">{format(b.start_time, "kk:mm")}</Typography>
                    </td>
                    {
                        Array(range.end_day + 1).fill(0).map((_, i) => {
                            const lesson = Lessons.find(l => l.block._id === b._id && l.day === i)

                            return <SizedCell 
                                key={i} 
                                height={`${100 * (differenceInMinutes(b.end_time, b.start_time) / getDayLength(LessonBlocks))}%`}
                                width={`${90 / (range.end_day + 1)}%`}
                            >
                                { lesson ?
                                    <LessonCard 
                                        lesson={lesson}
                                        onClick={() => navigate((editView ? "edit/" : "") + lesson._id)}
                                    />
                                    :
                                    <Filler 
                                        addable={!b.filler} 
                                        editView={editView}
                                        clicked={() => edit(b as LessonBlock, i)}
                                    />
                                }
                            </SizedCell>
                        })
                    }
                </tr>
            )
        }
    </tbody> 

}

export default function TimetableView(props: TimetableViewProps) {
    const { creating, editView, edit } = props

    const { week } = useWeek()

    const [lessons, setLessons] = useState<Lesson[]>()
    const [lessonBlocks, setLessonBlocks] = useState<LessonBlock[]>()
    const [range, setRange] = useState<{start_day: number, end_day: number}>()

    const user = useContext(userContext)

    const fetchLessons = useCallback(async () => {
        if(week) {
            const tempLessons = await User.forge(user.id).lessons?.get()
            setLessons(
                tempLessons?.filter(l => week.some(r => r._id === l.repeat._id))
            )
        }
    }, [user.id, week])

    const fetchBlocks = useCallback(async () => {
        setLessonBlocks(await User.forge(user.id).lessonBlocks?.get())
    }, [user.id])

    useEffect(() => {
        fetchBlocks()
    }, [fetchBlocks])

    useEffect(() => {
        fetchLessons()
    }, [fetchLessons, creating])

    useEffect(() => {
        if(week) setRange({
            start_day: week[0].start_day,
            end_day: week[week.length - 1].end_day
        })
    }, [week])
    
    const LessonTable = styled('table')({
        width: '100%',
        height: '100%'
    })

    return <>
        { (lessons && lessonBlocks && range && week) ?
            <LessonTable>
                <DateRow dayCount={range.end_day + 1}/>
                <LessonGrid LessonBlocks={lessonBlocks} range={range} Lessons={lessons} editView={editView} edit={edit}/>
            </LessonTable>
            :
            <Stack direction="column" alignItems="center" justifyContent="center" spacing={2}>
                <CircularProgress/>
            </Stack>
        }
    </>
}
