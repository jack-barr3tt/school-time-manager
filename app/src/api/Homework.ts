import Subject from "./Subjects";

export default class Homework {
    readonly id: number;
    readonly task: string;
    readonly subject: Subject;
    readonly due: Date;
    readonly difficulty: number;

    constructor(data: Homework) {
        this.id = data.id
        this.task = data.task
        this.subject = new Subject(data.subject)
        this.due = new Date(data.due)
        this.difficulty = data.difficulty
    }
}