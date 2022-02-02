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