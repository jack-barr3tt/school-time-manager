import axios from "axios";
import Subject from "./Subjects";

export default class Homework {
    readonly _id: number;
    private user_id: number;
    readonly task: string;
    readonly subject: Subject;
    readonly due?: Date;
    readonly difficulty: number;

    constructor(data: Homework) {
        this._id = data._id
        this.user_id = data.user_id
        this.task = data.task
        this.subject = new Subject(data.subject)
        this.due = data.due == null ? undefined : new Date(data.due)
        this.difficulty = data.difficulty
    }

    async delete() {
        const { data } = await axios.delete(`http://localhost:3000/users/${this.user_id}/homework/${this._id}`)
        return data
    }

    async edit(newData: Partial<Homework>) {
        const { data } = await axios.patch<Homework>(`http://localhost:3000/users/${this.user_id}/homework/${this._id}`, {
            task: newData.task,
            subject_id: newData.subject?._id,
            due: newData.due?.getTime(),
            difficulty: newData.difficulty
        })
        return data
    }
}