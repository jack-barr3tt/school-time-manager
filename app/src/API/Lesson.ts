import axios from "axios";
import LessonBlock from "./LessonBlock";
import Location from "./Location";
import Subject from "./Subjects";
import Teacher from "./Teacher";

export default class Lesson {
    readonly _id: number;
    private user_id: number;
    readonly subject: Subject;
    readonly block: LessonBlock;
    readonly location: Location;
    readonly teacher: Teacher;
    readonly day: number;

    constructor(data: Lesson) {
        this._id = data._id
        this.user_id = data.user_id
        this.subject = new Subject(data.subject)
        this.block = new LessonBlock(data.block)
        this.location = new Location(data.location)
        this.teacher = new Teacher(data.teacher)
        this.day = data.day
    }

    async edit(changes: Partial<Lesson>) {
        const { data } = await axios.patch<Lesson>(`http://localhost:3000/users/${this.user_id}/lessons/${this._id}`, changes)
        return new Lesson(data)
    }

    async delete() {
        await axios.delete(`http://localhost:3000/users/${this.user_id}/lessons/${this._id}`)
    }

}