import { AxiosResponse } from "axios";
import AxiosBase from "./AxiosBase";
import Homework from "./Homework";

type HomeworkCreate = {
    task: string;
    subject_id: number;
    due?: number;
    duration?: number;
}

export default class HomeworkManager {
    private userId: number;

    constructor(userId: number) {
        this.userId = userId
    }

    async get() : Promise<Homework[]>
    async get(id: number) : Promise<Homework>
    async get(id?: number) {
        if(id) {
            const { data } = await AxiosBase.get(`/users/${this.userId}/homework/${id}`) as AxiosResponse<Homework>
            return new Homework(data)
        }else{
            const { data } = await AxiosBase.get(`/users/${this.userId}/homework`) as AxiosResponse<Homework[]>
            return data.map(s => new Homework(s))
        }
    }
    
    async create(homework: HomeworkCreate) {
        const { data } = await AxiosBase.post<Homework>(`/users/${this.userId}/homework`, homework)
        return data
    }
}