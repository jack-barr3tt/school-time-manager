import AxiosBase from "./AxiosBase";
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
            const { data } = await AxiosBase.get<Location>(`/users/${this.userId}/locations/${id}`)
            return new Location(data)
        }else{
            const { data } = await AxiosBase.get<Location[]>(`/users/${this.userId}/locations`)
            return data.map(l => new Location(l))
        }
    }

    async create(name: string) {
        const { data } = await AxiosBase.post<Location>(`/users/${this.userId}/locations`, { name })
        return new Location(data)
    }
}