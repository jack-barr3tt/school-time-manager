import axios from "axios";

export type SubjectInput = {
    _id?: number;
    name: string;
    color?: number;
    inputValue?: string;
}

export default class Subject {
    readonly _id: number;
    readonly user_id: number;
    readonly name: string;
    readonly color: number;

    constructor(data: Subject) {
        this._id = data._id
        this.user_id = data.user_id
        this.name = data.name
        this.color = data.color
    }

    async delete() {
        await axios.delete(`http://localhost:3000/users/${this.user_id}/subjects/${this._id}`)
    }

    async edit(changes: Partial<Subject>) {
        const { data } = await axios.patch(`http://localhost:3000/users/${this.user_id}/subjects/${this._id}`, changes)
        return new Subject(data)
    }
}