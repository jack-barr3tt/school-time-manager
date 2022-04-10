import AxiosBase from "./AxiosBase";
import LessonBlock from "./LessonBlock";

type LessonBlockCreate = {
    name: string,
    start_time: number,
    end_time: number
}

export default class LessonBlockManager {
    private userId: number

    constructor(userId: number) {
        this.userId = userId
    }

    // Get method will fetch all the lesson blocks for the user if no id is provided, otherwise it will fetch the lesson block with the provided id
    async get() : Promise<LessonBlock[]>
    async get(id: number) : Promise<LessonBlock> 
    async get(id?: number)
    {
        if(id) {
            const { data } = await AxiosBase.get<LessonBlock>(`/users/${this.userId}/blocks/${id}`)
            return new LessonBlock(data)
        }else{
            const { data } = await AxiosBase.get<LessonBlock[]>(`/users/${this.userId}/blocks`)
            return data.map(s => new LessonBlock(s))
        }   
    }

    async create(block: LessonBlockCreate) {
        const { data } = await AxiosBase.post<LessonBlock>(`/users/${this.userId}/blocks`, block)
        return data
    }
}