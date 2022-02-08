import axios from "axios";
import WorkingTime from "./WorkingTimes";

type WorkingTimeCreate = {
    start_time: number,
    end_time: number
}

export default class WorkingTimesManager {
    private userId: number;

    constructor(userId: number) {
        this.userId = userId
    }

    async get() : Promise<WorkingTime[]>
    async get(id: number) : Promise<WorkingTime> 
    async get(id?: number)
    {
        if(id) {
            const { data } = await axios.get<WorkingTime>(`http://localhost:3000/users/${this.userId}/times/${id}`)
            return new WorkingTime(data)
        }else{
            const { data } = await axios.get<WorkingTime[]>(`http://localhost:3000/users/${this.userId}/times`)
            return data.map(s => new WorkingTime(s))
        }   
    }

    async create(time: WorkingTimeCreate) {
        const { data } = await axios.post(`http://localhost:3000/users/${this.userId}/times`, time)
        return data as WorkingTime
    }
}