import axios from "axios";

const getComponents = (date: Date) => {
    const main = (""+date).split(".")[0]
    return main.split(":").map(r => parseInt(r))    
}

export default class WorkingTime {
    readonly _id: number;
    private user_id: number;
    readonly start_time: Date;
    readonly end_time: Date;

    constructor(data: WorkingTime) {
        this._id = data._id
        this.user_id = data.user_id
        this.start_time = new Date(0,0,0, ...getComponents(data.start_time))
        this.end_time = new Date(new Date(0,0,0, ...getComponents(data.end_time)))
    }

    async delete() {
        const { data } = await axios.delete(`http://localhost:3000/users/${this.user_id}/times/${this._id}`)
        return data
    }

    async edit(newData: Partial<WorkingTime>) {
        const { data } = await axios.patch(`http://localhost:3000/users/${this.user_id}/times/${this._id}`, newData)
        return data as WorkingTime
    }
}