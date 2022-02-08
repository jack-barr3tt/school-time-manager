import axios, { AxiosResponse } from "axios";
import Subject from "./Subjects";

type SubjectCreate = {
    name: string,
    color?: number
}

export default class SubjectManager {
    private userId: number;

    constructor(userId: number) {
        this.userId = userId
    }
    
    async get() {
        const { data } = await axios.get(`http://localhost:3000/users/${this.userId}/subjects`) as AxiosResponse<Subject[]>
        return data.map(s => new Subject(s))
    }

    async create(subject: SubjectCreate) {
        const { data } = await axios.post(`http://localhost:3000/users/${this.userId}/subjects`, subject)
        return data as Subject
    }
}