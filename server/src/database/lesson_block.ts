import Database from "../connections";

export class LessonBlock {
    private _id?: number;
    public get id() {
        return this._id
    }
    private set id(newId: number|undefined) {
        this._id = newId
    }
    readonly user_id: number;
    public name: string;
    public start_time: Date;
    public end_time: Date;

    constructor(data: LessonBlock) {
        this.id = data.id
        this.user_id = data.user_id
        this.name = data.name
        this.start_time = data.start_time
        this.end_time = data.end_time
    }

    async save() {
        if(this.id) {
            const { rows } = await Database.query(
                `UPDATE lesson_blocks
                SET name = $2, start_time = to_timestamp($3 / 1000.0)::TIME, end_time = to_timestamp($4 / 1000.0)::TIME 
                WHERE id = $1
                RETURNING start_time, end_time`, 
                [
                    this.id, 
                    this.name,
                    this.start_time, 
                    this.end_time
                ]
            )
            this.start_time = rows[0].start_time
            this.end_time = rows[0].end_time
            return this
        } else {
            const { rows } = await Database.query(
                `INSERT INTO lesson_blocks (user_id, name, start_time, end_time)
                VALUES ($1, $2, to_timestamp($3 / 1000.0)::TIME, to_timestamp($4 / 1000.0)::TIME)
                RETURNING id`, 
                [
                    this.user_id, 
                    this.name,
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
            `SELECT * FROM lesson_blocks WHERE id = $1 AND user_id = $2`,
            [id, userId]
        )
        if(rows.length === 0) return null
        
        const lesson_block = new LessonBlock(rows[0])
        lesson_block.id = rows[0].id
        
        return lesson_block
    }

    static async findByUser(userId: string) {
        const { rows } = await Database.query(
            `SELECT * FROM lesson_blocks WHERE user_id = $1`,
            [userId]
        )

        return rows.map(row => {
            let block = new LessonBlock(row)
            block._id = row.id
            return block
        })    
    }

    async delete() {
        if(!this.id) return
        Database.query(
            `DELETE FROM lesson_blocks WHERE id = $1`,
            [this.id]
        )
    }
}