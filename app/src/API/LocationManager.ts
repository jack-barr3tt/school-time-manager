import axios from "axios";
import Location from "./Location";

export default class LocationManager {
    private userId: number;

    constructor(userId: number) {
        this.userId = userId
    }

    async get() : Promise<Location[]>
    async get(id: number) : Promise<Location>
    async get(id?: number)
    {
        if(id) {
            const { data } = await axios.get<Location>(`http://localhost:3000/users/${this.userId}/locations/${id}`)
            return new Location(data)
        }else{
            const { data } = await axios.get<Location[]>(`http://localhost:3000/users/${this.userId}/locations`)
            return data.map(l => new Location(l))
        }
    }

    async create(name: string) {
        const { data } = await axios.post<Location>(`http://localhost:3000/users/${this.userId}/locations`, { name })
        return new Location(data)
    }
}