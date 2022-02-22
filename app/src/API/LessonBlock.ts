import axios from "axios";

const getComponents = (date: Date) => {
    const main = (""+date).split(".")[0]
    return main.split(":").map(r => parseInt(r))    
}

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
        this.start_time = new Date(0,0,0, ...getComponents(data.start_time))
        this.end_time = new Date(new Date(0,0,0, ...getComponents(data.end_time)))
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