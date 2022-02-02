export default class Subject {
    readonly id: number;
    readonly name: string;
    readonly color: number;

    constructor(data: Subject) {
        this.id = data.id
        this.name = data.name
        this.color = data.color
    }
}