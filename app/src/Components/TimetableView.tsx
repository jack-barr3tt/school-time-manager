import { Add } from "@mui/icons-material"
import { ButtonBase, CircularProgress, Paper, Stack, styled, Typography } from "@mui/material"
import { addDays, compareAsc, differenceInMinutes, format, isSameDay, isSameMinute, startOfWeek } from "date-fns"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Lesson from "../API/Lesson"
import LessonBlock from "../API/LessonBlock"
import { User } from "../API/Users"
import { DayIndexToString, MergeSort } from "../functions"
import { useUser } from "../Hooks/useUser"
import ContrastTypography from "./ConstrastTypography"
import { SizedCell } from "./SizedCell"
import SizedPaper from "./SizedPaper"

type TimetableRange = {
    start_day: number
    end_day: number
}

type DateRowProps = {
    dayCount: number
}

type TimetableViewProps = {
    creating: boolean
    editView: boolean
    weekNo: number
    edit: (block: LessonBlock, day: number) => void
}

type FillerProps = {
    addable: boolean,
    editView: boolean,
    clicked: () => void
}

type LessonCardProps = {
    lesson: Lesson
    onClick: () => void
}

type LessonGridProps = {
    editView: boolean,
    range: TimetableRange,
    LessonBlocks: LessonBlock[],
    Lessons: Lesson[],
    edit: (block: LessonBlock, day: number) => void
}

type LessonBlockOrFiller = { 
    _id?: number, 
    name: string, 
    start_time: Date, 
    end_time: Date, 
    filler?: boolean
}

function DateRow(props: DateRowProps) {
    const { dayCount } = props
    
    // The top row of the table will always be 10% of the height of the whole table
    const HeaderRow = styled("thead")({
        height: '10%'
    })

    // Returns a row of the table with the day names and dates, with the current date highlighted
    return <HeaderRow>
        <tr>
            <td/>
            { 
                Array(dayCount).fill(0).map((_, i) => {
                    const thisDay = addDays(startOfWeek(new Date(), {weekStartsOn: 1}), i) // Gets the date of this day in the week
                    const sameDay = isSameDay(new Date(), thisDay) 
                    const circleColor = sameDay ? "primary.main" : "background.default" // If this day is today, highlight it
                    
                    return <SizedCell key={i} width={`${90 / dayCount}%`}>
                        <Stack direction="column" alignItems="center" spacing={0.75}>
                            <Paper 
                                elevation={0}
                                sx={{
                                    borderRadius: "50%", 
                                    width: "2.5rem", 
                                    aspectRatio: "1", 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center", 
                                    backgroundColor: circleColor
                                }}>
                                <ContrastTypography backgroundColor={circleColor} variant="h6">{format(thisDay, "d")}</ContrastTypography>
                            </Paper>
                            <ContrastTypography backgroundColor={circleColor}>{DayIndexToString(i)}</ContrastTypography>
                        </Stack>
                    </SizedCell>
                })
            }
        </tr>
    </HeaderRow>
}

/*
Some lesson blocks may not have lessons in, so to ensure everything is rendered in the correct places,
all unfilled blocks are filled with a filler block.
*/
const getBlocksWithFillers = (blocks: LessonBlock[]) => {
    const temp: LessonBlockOrFiller[] = []
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

// Gets the difference in time between the earliest and latest lesson block
function getDayLength (day: LessonBlock[]) {
    const sortedBlocks = MergeSort(
        day, 
        (a, b) => compareAsc(a.start_time, b.start_time)
    )

    return differenceInMinutes(
        sortedBlocks[sortedBlocks.length - 1].end_time, // End of the last lesson
        sortedBlocks[0].start_time // Start of the first lesson
    )
}

// Fillers will render an add button when the user is in edit mode, otherwise they render nothing
function Filler(props: FillerProps) {
    const { addable, editView, clicked } = props

    if(editView && addable) { // We also need to know if a lesson block is "addable", i.e does a lesson block actually exist at this time?
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

    // Displays lesson data in a card
    return <SizedPaper color={lesson.subject.color} onClick={onClick}>
            <ContrastTypography 
                backgroundColor={lesson.subject.color}
                variant="subtitle1" 
                sx={{ 
                    width: 1, 
                    textAlign: "left", 
                    fontWeight: "bold", 
                    wordWrap: "break-word", 
                    wordBreak: "break-all", 
                    lineHeight: "1.25rem" 
                }}
            >
                {lesson.subject.name}
            </ContrastTypography>

            <ContrastTypography 
                backgroundColor={lesson.subject.color} 
                variant="body2" 
                sx={{ 
                    width: 1, 
                    textAlign: "left", 
                    textOverflow: "ellipsis", 
                    lineHeight: "1.25rem" 
                }}
            >
                {lesson.location.name}
            </ContrastTypography> 
    </SizedPaper>
}

function LessonGrid(props: LessonGridProps) {
    const { Lessons, LessonBlocks, range, editView, edit } = props

    const navigate = useNavigate()

    const [blocksWithFillers, setBlocksWithFillers] = useState<LessonBlockOrFiller[]>()

    // When the component mounts, we need to get the blocks and fillers
    useEffect(() => {
        setBlocksWithFillers(getBlocksWithFillers(LessonBlocks))
    }, [LessonBlocks])

    return <tbody>
        {
            blocksWithFillers && blocksWithFillers.map((b, blockI) => 
                // For each block, we render a row of the table
                <tr key={b._id || `f-${blockI}`}>
                    <td>
                        {/* The first column will contain the start time of the block */}
                        <Typography sx={{ height: 1 }}>{format(b.start_time, "kk:mm")}</Typography> 
                    </td>
                    {
                        Array(range.end_day + 1).fill(0).map((_, i) => {
                            const lesson = Lessons.find(l => l.block._id === b._id && l.day === i) // Find the lesson in this block on this day

                            return <SizedCell 
                                key={i} 
                                // Height of the cell is proportional to the length of the lesson block
                                height={`${100 * (differenceInMinutes(b.end_time, b.start_time) / getDayLength(LessonBlocks))}%`}
                                width={`${90 / (range.end_day + 1)}%`}
                            >
                                { lesson ?
                                    // If there is a lesson at this time, we render it as a car
                                    <LessonCard 
                                        lesson={lesson}
                                        onClick={() => navigate((editView ? "edit/" : "") + lesson._id)}
                                    />
                                    :
                                    // Otherwise we render a filler
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
    const { creating, editView, weekNo, edit } = props

    const [lessons, setLessons] = useState<Lesson[]>()
    const [lessonBlocks, setLessonBlocks] = useState<LessonBlock[]>()
    const [range, setRange] = useState<{start_day: number, end_day: number}>()

    const { userId } = useUser()

    const fetchLessons = useCallback(async () => {
        const tempWeek = await User.forge(userId).lessons?.getWeek()
        if(tempWeek) setLessons(tempWeek.lessons)
    }, [userId, ])

    const fetchBlocks = useCallback(async () => {
        setLessonBlocks(await User.forge(userId).lessonBlocks?.get())
    }, [userId])

    // When the component mounts, we need to fetch the lessons and blocks
    useEffect(() => {
        fetchBlocks()
    }, [fetchBlocks])

    // When the user starts or stops creating a lesson, we need to re-fetch the lessons
    useEffect(() => {
        fetchLessons()
    }, [fetchLessons, creating, weekNo])

    // Set the day range to the number of days in the current week
    useEffect(() => {
        if(lessons) setRange({
            start_day: lessons.reduce((a, b) => a < b.day ? a : b.day, 0),
            end_day: lessons.reduce((a, b) => a > b.day ? a : b.day, 0)
        })
    }, [lessons])

    const LessonTable = styled('table')({
        width: '100%',
        height: '100%'
    })

    return <>
        { (lessons && lessonBlocks && range) ?
            // Display the lesson table if we have all the data
            <LessonTable>
                <DateRow dayCount={range.end_day + 1}/>
                <LessonGrid LessonBlocks={lessonBlocks} range={range} Lessons={lessons} editView={editView} edit={edit}/>
            </LessonTable>
            :
            // Otherwise display a loading indicator
            <Stack direction="column" alignItems="center" justifyContent="center" spacing={2}>
                <CircularProgress/>
            </Stack>
        }
    </>
}
