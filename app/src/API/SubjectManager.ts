import AxiosBase from "./AxiosBase";
import Subject from "./Subjects";

type SubjectCreate = {
    name: string,
    color?: number
}

export default class SubjectManager {
    private userId: number

    constructor(userId: number) {
        this.userId = userId
    }
    
    // Get method will fetch all the subjects for the user if no id is provided, otherwise it will fetch the subject with the provided id
    async get() : Promise<Subject[]>
    async get(id: number) : Promise<Subject>
    async get(id?: number) {
        if(id) {
            const { data } = await AxiosBase.get<Subject>(`/users/${this.userId}/subjects/${id}`)
            return new Subject(data)
        }else{
            const { data } = await AxiosBase.get<Subject[]>(`/users/${this.userId}/subjects`)
            return data.map(s => new Subject(s))
        }
    }

    async create(subject: SubjectCreate) {
        const { data } = await AxiosBase.post<Subject>(`/users/${this.userId}/subjects`, subject)
        return data
    }
}