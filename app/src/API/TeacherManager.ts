import AxiosBase from "./AxiosBase";
import Teacher from "./Teacher";

export default class TeacherManager {
    private userId: number;

    constructor(userId: number) {
        this.userId = userId
    }

    async get() : Promise<Teacher[]>
    async get(id: number) : Promise<Teacher>
    async get(id?: number)
    {
        if(id) {
            const { data } = await AxiosBase.get<Teacher>(`/users/${this.userId}/teachers/${id}`)
            return new Teacher(data)
        }else{
            const { data } = await AxiosBase.get<Teacher[]>(`/users/${this.userId}/teachers`)
            return data.map(t => new Teacher(t))
        }
    }

    async create(name: string) {
        const { data } = await AxiosBase.post<Teacher>(`/users/${this.userId}/teachers`, { name })
        return new Teacher(data)
    }
}