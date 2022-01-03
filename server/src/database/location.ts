import Database from "../connections";

export class Location {
    private _id?: number;
    public get id() {
        return this._id
    }
    private set id(newId: number|undefined) {
        this._id = newId
    }
    readonly user_id: number;
    public name: string;

    constructor(data: Location) {
        this.user_id = data.user_id
        this.name = data.name
    }

    async save() {
        if(this.id) {
            await Database.query(
                `UPDATE locations
                SET name = $2
                WHERE id = $1`,
                [

                ]
            )
        }else{
            const { rows } = await Database.query(
                `INSERT INTO locations (user_id, name)
                VALUES ($1, $2)
                RETURNING id`,
                [
                    this.user_id,
                    this.name
                ]
            )
            this.id = rows[0].id
            return this
        }
    }

    static async findById(id: string, userId: string) {
        const { rows } = await Database.query(
            'SELECT * FROM locations WHERE id = $1 AND user_id = $2',
            [id, userId]
        )
        if(rows.length === 0) return null
        
        const location = new Location(rows[0])
        location.id = rows[0].id
        
        return location
    }

    static async findByUser(userId: string) {
        const { rows } = await Database.query(
            'SELECT * FROM locations WHERE user_id = $1',
            [userId]
        )
        
        return rows.map(row => {
            let block = new Location(row)
            block._id = row.id
            return block
        })  
    }

    async delete() {
        if(!this.id) return
        await Database.query(
            'DELETE FROM locations WHERE id = $1',
            [this.id]
        )
    }
}