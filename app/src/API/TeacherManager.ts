import axios from "axios";
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
            const { data } = await axios.get<Teacher>(`http://localhost:3000/users/${this.userId}/teachers/${id}`)
            return new Teacher(data)
        }else{
            const { data } = await axios.get<Teacher[]>(`http://localhost:3000/users/${this.userId}/teachers`)
            return data.map(t => new Teacher(t))
        }
    }

    async create(name: string) {
        const { data } = await axios.post<Teacher>(`http://localhost:3000/users/${this.userId}/teachers`, { name })
        return new Teacher(data)
    }
}