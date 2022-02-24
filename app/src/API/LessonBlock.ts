import axios from "axios";

export default class LessonBlock {
    readonly _id: number;
    private user_id: number;
    readonly name: string;
    readonly start_time: Date;
    readonly end_time: Date;

    constructor(data: LessonBlock) {
        this._id = data._id
        this.user_id = +data.user_id
        this.name = data.name
        this.start_time = new Date(data.start_time)
        this.end_time = new Date(data.end_time)
    }

    async delete() {
        const { data } = await axios.delete(`http://localhost:3000/users/${this.user_id}/blocks/${this._id}`)
        return data
    }

    async edit(newData: Partial<LessonBlock>) {
        const { data } = await axios.patch<LessonBlock>(`http://localhost:3000/users/${this.user_id}/blocks/${this._id}`, {
            name: newData.name,
            start_time: newData.start_time?.getTime(),
            end_time: newData.end_time?.getTime()
        })
        return data
    }
}