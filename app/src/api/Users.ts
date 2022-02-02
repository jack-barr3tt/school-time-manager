import axios, { AxiosResponse } from "axios";
import HomeworkManager from "./HomeworkManager";
import SubjectManager from "./SubjectManager";

export class User {
    readonly id: number;
    readonly email : string;
    readonly username : string;
    readonly subjects : SubjectManager;
    readonly homework : HomeworkManager;

    constructor(data: User) {
        this.id = data.id
        this.email = data.email
        this.username = data.username
        this.subjects = new SubjectManager(this.id)
        this.homework = new HomeworkManager(this.id)
    }

    static forge(id: number) {
        return { 
            id, 
            subjects: new SubjectManager(id),
            homework: new HomeworkManager(id)
        } as Partial<User>
    }

    static async get(id: number) {
        const { data } = await axios.get(`http://localhost:3000/users/${id}`) as AxiosResponse<User>
        return new User(data)
    }
}