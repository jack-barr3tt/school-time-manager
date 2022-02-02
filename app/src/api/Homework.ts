import Subject from "./Subjects";

export default class Homework {
    readonly _id: number;
    readonly task: string;
    readonly subject: Subject;
    readonly due: Date;
    readonly difficulty: number;

    constructor(data: Homework) {
        this._id = data._id
        this.task = data.task
        this.subject = new Subject(data.subject)
        this.due = new Date(data.due)
        this.difficulty = data.difficulty
    }
}