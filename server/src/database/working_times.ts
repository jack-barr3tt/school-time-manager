import Database from "../connections";

export class WorkingTime {
    private _id?: number
    public get id() {
        return this._id
    }
    private set id(newId: number|undefined) {
        this._id = newId
    }
    readonly user_id: number
    public start_time: number
    public end_time: number

    constructor(data: WorkingTime) {
        this.id = data.id
        this.user_id = +data.user_id
        this.start_time = data.start_time && +data.start_time
        this.end_time = data.end_time && +data.end_time
    }

    async save() {
        if(this.id) {
            const { rows } = await Database.query(
                `UPDATE working_times
                SET start_time = $2, end_time = $3
                WHERE id = $1
                RETURNING start_time, end_time`, 
                [
                    this.id, 
                    this.start_time, 
                    this.end_time
                ]
            )
            this.start_time = rows[0].start_time
            this.end_time = rows[0].end_time
            return this
        } else {
            const { rows } = await Database.query(
                `INSERT INTO working_times (user_id, start_time, end_time)
                VALUES ($1, $2, $3)
                RETURNING id`, 
                [
                    this.user_id, 
                    this.start_time,
                    this.end_time
                ]
            )
            this.id = rows[0].id
            return this
        }
    }

    static async findById(id: string, userId: string) {
        const { rows } = await Database.query(
            `SELECT * FROM working_times WHERE id = $1 AND user_id = $2`,
            [id, userId]
        )
        if(rows.length === 0) return null
        
        const lesson_block = new WorkingTime(rows[0])
        lesson_block.id = rows[0].id
        
        return lesson_block
    }

    static async findByUser(userId: string) {
        const { rows } = await Database.query(
            `SELECT * FROM working_times WHERE user_id = $1`,
            [userId]
        )

        return rows.map(row => {
            let block = new WorkingTime(row)
            block._id = row.id
            return block
        })    
    }

    async delete() {
        if(!this.id) return
        Database.query(
            `DELETE FROM working_times WHERE id = $1`,
            [this.id]
        )
    }
}