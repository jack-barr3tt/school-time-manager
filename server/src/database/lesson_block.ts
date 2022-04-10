import Database from "../connections";

export class LessonBlock {
    private _id?: number
    public get id() {
        return this._id
    }
    private set id(newId: number|undefined) {
        this._id = newId
    }
    readonly user_id: number
    public name: string
    public start_time: number
    public end_time: number

    constructor(data: LessonBlock) {
        this.id = data.id
        this.user_id = +data.user_id
        this.name = data.name
        this.start_time = data.start_time && +data.start_time
        this.end_time = data.end_time && +data.end_time
    }

    async save() {
        if(this.id) {
            // If the lesson block has an id, it already exists in the database, so we update it
            await Database.query(
                `UPDATE lesson_blocks
                SET name = $2, start_time = $3, end_time = $4
                WHERE id = $1`, 
                [
                    this.id, 
                    this.name,
                    this.start_time, 
                    this.end_time
                ]
            )
            return this
        } else {
            // When the homework is created, we want to get it's id
            const { rows } = await Database.query(
                `INSERT INTO lesson_blocks (user_id, name, start_time, end_time)
                VALUES ($1, $2, $3, $4)
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
        await Database.query(
            `DELETE FROM lesson_blocks WHERE id = $1`,
            [this.id]
        )
    }
}