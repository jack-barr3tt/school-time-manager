import axios from "axios"
import Lesson from "./Lesson"

type LessonCreate = {
    subject_id: number;
    block_id: number;
    location_id?: number;
    teacher_id?: number;
    repeat_id?: number;
    day: number;
}

export default class LessonManager {
    private userId: number

    constructor(userId: number) {
        this.userId = userId
    }

    async get() : Promise<Lesson[]>
    async get(id: number) : Promise<Lesson>
    async get(id?: number) {
        if(id) {
            const { data } = await axios.get<Lesson>(`http://localhost:3000/users/${this.userId}/lessons/${id}`)
            return new Lesson(data)
        }else{
            const { data } = await axios.get<Lesson[]>(`http://localhost:3000/users/${this.userId}/lessons`)
            return data.map(l => new Lesson(l))
        }
    }

    async create(lesson: LessonCreate) {
        const { data } = await axios.post<Lesson>(`http://localhost:3000/users/${this.userId}/lessons`, lesson)
        return new Lesson(data)
    }
}