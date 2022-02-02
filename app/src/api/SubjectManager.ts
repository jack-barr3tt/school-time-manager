import axios, { AxiosResponse } from "axios";
import Subject from "./Subjects";

export default class SubjectManager {
    private userId: number;

    constructor(userId: number) {
        this.userId = userId
    }
    
    async get() {
        const { data } = await axios.get(`http://localhost:3000/users/${this.userId}/subjects`) as AxiosResponse<Subject[]>
        return data.map(s => new Subject(s))
    }

    async create(subject: Subject) {
        await axios.post(`http://localhost:3000/users/${this.userId}/subjects`, subject)
    }
}