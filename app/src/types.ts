export interface Homework {
    id: string;
    task: string;
    subject: Subject;
    due?: Date;
    difficulty?: number;
}

export interface Subject {
    id: string;
    name: string;
    color: number;
}