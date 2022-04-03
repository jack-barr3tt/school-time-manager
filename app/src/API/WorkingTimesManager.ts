import AxiosBase from "./AxiosBase";
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
            const { data } = await AxiosBase.get<WorkingTime>(`/users/${this.userId}/times/${id}`)
            return new WorkingTime(data)
        }else{
            const { data } = await AxiosBase.get<WorkingTime[]>(`/users/${this.userId}/times`)
            return data.map(s => new WorkingTime(s))
        }   
    }

    async create(time: WorkingTimeCreate) {
        const { data } = await AxiosBase.post<WorkingTime>(`/users/${this.userId}/times`, time)
        return data
    }
}