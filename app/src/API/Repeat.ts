import AxiosBase from "./AxiosBase";

export default class Repeat {
    readonly _id: number
    private user_id: number
    public name: string
    public start_day: number
    public end_day: number
    public index: number

    constructor(data: Repeat) {
        this._id = data._id
        this.user_id = +data.user_id
        this.name = data.name
        this.start_day = data.start_day
        this.end_day = data.end_day
        this.index = data.index
    }

    async delete() {
        await AxiosBase.delete(`/users/${this.user_id}/repeats/${this._id}`)
    }

    async edit(changes: Partial<Repeat>) {
        const { data } = await AxiosBase.patch<Repeat>(`/users/${this.user_id}/repeats/${this._id}`, changes)
        return new Repeat(data)
    }
}