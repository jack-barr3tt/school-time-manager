import axios from "axios";
import Repeat from "./Repeat";

type RepeatCreate = {
    name: string,
    start_day: number,
    end_day: number,
}

export default class RepeatManager {
    private userId: number;

    constructor(userId: number) {
        this.userId = userId
    }

    async get() : Promise<Repeat[]>
    async get(id: number) : Promise<Repeat>
    async get(id?: number)
    {
        if(id) {
            const { data } = await axios.get<Repeat>(`http://localhost:3000/users/${this.userId}/repeats/${id}`)
            return new Repeat(data)
        }else{
            const { data } = await axios.get<Repeat[]>(`http://localhost:3000/users/${this.userId}/repeats`)
            return data.map(r => new Repeat(r))
        }
    } 

    async create(repeat: RepeatCreate) {
        const { data } = await axios.post<Repeat>(`http://localhost:3000/users/${this.userId}/repeats`, repeat)
        return new Repeat(data)
    }
}