import AxiosBase from "./AxiosBase";

export type TeacherInput = {
    _id?: number
    name: string
    inputValue?: string
}

export default class Teacher {
    readonly _id: number
    private user_id: number
    public name: string

    constructor(data: Teacher) {
        this._id = data._id
        this.user_id = +data.user_id
        this.name = data.name
    }

    async edit(changes: Partial<Teacher>) {
        const { data } = await AxiosBase.patch<Teacher>(`/users/${this.user_id}/teachers/${this._id}`, changes)
        return new Teacher(data)
    }

    async delete() {
        await AxiosBase.delete(`/users/${this.user_id}/teachers/${this._id}`)
    }
}