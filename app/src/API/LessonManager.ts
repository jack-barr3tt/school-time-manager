import AxiosBase from "./AxiosBase";
import Lesson from "./Lesson"
import Repeat from "./Repeat";

type LessonCreate = {
    subject_id: number
    block_id: number
    location_id?: number
    teacher_id?: number
    repeat_id?: number
    day: number
}

export default class LessonManager {
    private userId: number

    constructor(userId: number) {
        this.userId = userId
    }

    // Get method will fetch all the lesson for the user if no id is provided, otherwise it will fetch the lesson with the provided id
    async get() : Promise<Lesson[]>
    async get(id: number) : Promise<Lesson>
    async get(id?: number) {
        if(id) {
            const { data } = await AxiosBase.get<Lesson>(`/users/${this.userId}/lessons/${id}`)
            return new Lesson(data)
        }else{
            const { data } = await AxiosBase.get<Lesson[]>(`/users/${this.userId}/lessons`)
            return data.map(l => new Lesson(l))
        }
    }

    // If a subject ID is provided it will query for that subject, otherwise it will just query for the next lesson
    async getNext(subjectId?: number) {
        const { data } = await AxiosBase.get<Lesson>(`/users/${this.userId}/lessons/next${subjectId ? `?subjectId=${subjectId}` : ""}`)
        if(data)
            return new Lesson(data)
        else return undefined
    }

    async getWeek() {
        const { data } = await AxiosBase.get<{ no: number, lessons: Lesson[], repeats: Repeat[] }>(`/users/${this.userId}/lessons/week`)
        return {
            ...data,
            lessons: data.lessons.map(l => new Lesson(l)),
            repeats: data.repeats.map(r => new Repeat(r))
        }
    }

    async getWeeks() {
        const { data } = await AxiosBase.get<{ lessons: Lesson[][][], repeats: Repeat[][] }>(`/users/${this.userId}/lessons/weeks`)
        return {
            lessons: data.lessons.map(w => w.map(r => r.map(l => new Lesson(l)))),
            repeats: data.repeats.map(w => w.map(r => new Repeat(r)))
        }
    }

    async create(lesson: LessonCreate) {
        const { data } = await AxiosBase.post<Lesson>(`/users/${this.userId}/lessons`, lesson)
        return new Lesson(data)
    }
}