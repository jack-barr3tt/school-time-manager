import axios from "axios";

export default class Repeat {
    readonly _id: number;
    private user_id: number;
    public name: string;
    public start_day: number;
    public end_day: number;

    constructor(data: Repeat) {
        this._id = data._id
        this.user_id = data.user_id
        this.name = data.name
        this.start_day = data.start_day
        this.end_day = data.end_day
    }

    async delete() {
        await axios.delete(`http://localhost:3000/users/${this.user_id}/repeats/${this._id}`)
    }

    async edit(changes: Partial<Repeat>) {
        const { data } = await axios.patch<Repeat>(`http://localhost:3000/users/${this.user_id}/repeats/${this._id}`, changes)
        return new Repeat(data)
    }
}