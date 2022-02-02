import axios, { AxiosResponse } from "axios";
import Homework from "./Homework";

export default class HomeworkManager {
    private userId: number;

    constructor(userId: number) {
        this.userId = userId
    }

    async get() {
        const { data } = await axios.get(`http://localhost:3000/users/${this.userId}/homework`) as AxiosResponse<Homework[]>
        return data.map(s => new Homework(s))
    }

    async create(homework: Homework) {
        await axios.post(`http://localhost:3000/users/${this.userId}/homework`, homework)
    }
}