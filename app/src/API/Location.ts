import AxiosBase from "./AxiosBase";

export type LocationInput = {
    _id?: number
    name: string
    inputValue?: string
}

export default class Location {
    readonly _id: number
    private user_id: number
    public name: string

    constructor(data: Location) {
        this._id = data._id
        this.user_id = +data.user_id
        this.name = data.name
    }

    async delete() {
        await AxiosBase.delete(`/users/${this.user_id}/locations/${this._id}`)
    }

    async edit(changes: Partial<Location>) {
        const { data } = await AxiosBase.patch<Location>(`/users/${this.user_id}/locations/${this._id}`, changes)
        return new Location(data)
    }
}