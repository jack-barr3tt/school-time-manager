import Database from "../connections";

export class Repeat {
    private _id?: number;
    public get id() {
        return this._id
    }
    private set id(newId: number|undefined) {
        this._id = newId
    }
    readonly user_id: number;
    public name: string;
    public start_day: Date;
    public end_day: Date;

    constructor(data: Repeat) {
        this.user_id = data.user_id
        this.name = data.name
        this.start_day = data.start_day
        this.end_day = data.end_day
    }

    async save() {
        if(this.id) {
            await Database.query(
                `UPDATE repeats
                SET name = $2, start_day = $3, end_day = $4
                WHERE id = $1`,
                [
                    this.id,
                    this.name,
                    this.start_day,
                    this.end_day
                ]
            )
            return this
        }else{
            const { rows } = await Database.query(
                `INSERT INTO repeats (user_id, name, start_day, end_day)
                VALUES ($1, $2, $3, $4)
                RETURNING id`,
                [
                    this.user_id,
                    this.name,
                    this.start_day,
                    this.end_day
                ]
            )

            this.id = rows[0].id
            return this
        }
    }

    static async findById(id: string) {
        const { rows } = await Database.query(
            `SELECT * FROM repeats WHERE id = $1`,
            [id]
        )
        if(rows.length === 0) return null
        
        const repeat = new Repeat(rows[0])
        repeat.id = rows[0].id
        
        return repeat
    }

    static async findByUser(userId: string) {
        const { rows } = await Database.query(
            `SELECT * FROM repeats WHERE user_id = $1`,
            [userId]
        )
             
        return rows.map(row => {
            let repeat = new Repeat(row)
            repeat._id = row.id
            return repeat
        })
    }

    async delete() {
        if(!this.id) return
        await Database.query(
            `DELETE FROM repeats WHERE id = $1`,
            [this.id]
        )
    }
}