import AxiosBase from "./AxiosBase";
import LessonBlock from "./LessonBlock";
import Location from "./Location";
import Repeat from "./Repeat";
import Subject from "./Subjects";
import Teacher from "./Teacher";

export default class Lesson {
    readonly _id: number
    private user_id: number
    readonly subject: Subject
    readonly block: LessonBlock
    readonly location: Location
    readonly teacher: Teacher
    readonly repeat: Repeat
    readonly day: number

    constructor(data: Lesson) {
        this._id = data._id
        this.user_id = +data.user_id
        this.subject = new Subject(data.subject)
        this.block = new LessonBlock(data.block)
        this.location = new Location(data.location)
        this.teacher = new Teacher(data.teacher)
        this.repeat = new Repeat(data.repeat)
        this.day = data.day
    }

    async edit(changes: Partial<Lesson>) {
        const { data } = await AxiosBase.patch<Lesson>(`/users/${this.user_id}/lessons/${this._id}`, {
            subject_id: changes.subject?._id,
            location_id: changes.location?._id,
            teacher_id: changes.teacher?._id
        })
        return new Lesson(data)
    }

    async delete() {
        await AxiosBase.delete(`/users/${this.user_id}/lessons/${this._id}`)
    }

}