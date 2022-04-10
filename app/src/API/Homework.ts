import AxiosBase from "./AxiosBase";
import Subject from "./Subjects";

export default class Homework {
    readonly _id: number
    private user_id: number
    readonly task: string
    readonly subject: Subject
    readonly due?: Date
    readonly duration: number
    readonly complete: boolean

    constructor(data: Homework) {
        this._id = data._id
        this.user_id = +data.user_id
        this.task = data.task
        this.subject = new Subject(data.subject)
        this.due = data.due == null ? undefined : new Date(data.due)
        this.duration = data.duration
        this.complete = data.complete
    }

    async delete() {
        const { data } = await AxiosBase.delete(`/users/${this.user_id}/homework/${this._id}`)
        return data
    }

    async edit(newData: Partial<Homework>) {
        const { data } = await AxiosBase.patch<Homework>(`/users/${this.user_id}/homework/${this._id}`, {
            task: newData.task,
            subject_id: newData.subject?._id,
            due: newData.due?.getTime(),
            duration: newData.duration
        })
        return data
    }

    async markComplete() {
        const { data } = await AxiosBase.patch<Homework>(`/users/${this.user_id}/homework/${this._id}`, {
            complete: true
        })
        return data
    }
}