import AxiosBase from "./AxiosBase";

export default class WorkingTime {
    readonly _id: number;
    private user_id: number;
    readonly start_time: Date;
    readonly end_time: Date;

    constructor(data: WorkingTime) {
        this._id = data._id
        this.user_id = +data.user_id
        this.start_time = new Date(data.start_time)
        this.end_time = new Date(data.end_time)
    }

    async delete() {
        const { data } = await AxiosBase.delete(`/users/${this.user_id}/times/${this._id}`)
        return data
    }

    async edit(newData: Partial<WorkingTime>) {
        const { data } = await AxiosBase.patch<WorkingTime>(`/users/${this.user_id}/times/${this._id}`, {
            start_time: newData.start_time?.getTime(),
            end_time: newData.end_time?.getTime()
        })
        return data
    }
}