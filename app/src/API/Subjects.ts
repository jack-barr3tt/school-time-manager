export type SubjectInput = {
    _id?: number;
    name: string;
    color?: number;
    inputValue?: string;
}

export default class Subject {
    readonly _id: number;
    readonly name: string;
    readonly color: number;

    constructor(data: Subject) {
        this._id = data._id
        this.name = data.name
        this.color = data.color
    }
}