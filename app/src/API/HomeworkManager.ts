import axios, { AxiosResponse } from "axios";
import Homework from "./Homework";

type HomeworkCreate = {
    task: string;
    subject_id: number;
    due?: number;
    difficulty?: number;
}

export default class HomeworkManager {
    private userId: number;

    constructor(userId: number) {
        this.userId = userId
    }

    async get(id?: number) {
        if(id) {
            const { data } = await axios.get(`http://localhost:3000/users/${this.userId}/homework/${id}`) as AxiosResponse<Homework>
            return new Homework(data)
        }else{
            const { data } = await axios.get(`http://localhost:3000/users/${this.userId}/homework`) as AxiosResponse<Homework[]>
            return data.map(s => new Homework(s))
        }
    }
    
    async create(homework: HomeworkCreate) {
        const { data } = await axios.post(`http://localhost:3000/users/${this.userId}/homework`, homework)
        return data as Homework
    }
}