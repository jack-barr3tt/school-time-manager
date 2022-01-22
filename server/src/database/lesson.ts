import Database from "../connections";

export class Lesson {
    private _id?: number;
    public get id() {
        return this._id
    }
    private set id(newId: number|undefined) {
        this._id = newId
    }
    readonly user_id: number;
    public subject_id: number;
    public block_id: number;
    public location_id: number;
    public teacher_id: number;
    public timetabled_day_id: number;

    constructor (data: Lesson) {
        this.user_id = data.user_id
        this.subject_id = data.subject_id
        this.block_id = data.block_id
        this.location_id = data.location_id
        this.teacher_id = data.teacher_id
        this.timetabled_day_id = data.timetabled_day_id
    }

    async save() {
        if(this.id) {
            await Database.query(`
                UPDATE lessons
                SET user_id = $2, subject_id = $3, block_id = $4, location_id = $5, teacher_id = $6, timetabled_day_id = $7
                WHERE id = $1
                `, [
                    this.id,
                    this.user_id,
                    this.subject_id,
                    this.block_id,
                    this.location_id,
                    this.teacher_id,
                    this.timetabled_day_id
                ]
            )
            return this
        }else{
            const { rows } = await Database.query(`
                INSERT INTO lessons (user_id, subject_id, block_id, location_id, teacher_id, timetabled_day_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
                `, [
                    this.user_id,
                    this.subject_id,
                    this.block_id,
                    this.location_id,
                    this.teacher_id,
                    this.timetabled_day_id
                ]
            )
            this.id = rows[0].id
            return this
        }
    }

    static async findById(id: string, userId: string) {
        const { rows } = await Database.query(
            `SELECT * FROM lessons
            WHERE id = $1 AND user_id = $2`, 
            [id, userId]
        )
        if(rows.length === 0) return null
        
        const lesson = new Lesson(rows[0])
        lesson.id = rows[0].id
        
        return lesson
    }

    static async findByUser(userId: string) {
        const { rows } = await Database.query(
            `SELECT * FROM lessons
            WHERE user_id = $1`,
            [userId]
        )
        
        return rows.map(row => {
            let lesson = new Lesson(row)
            lesson._id = row.id
            return lesson
        })
    }

    async delete() {
        if(!this.id) return
        await Database.query(`
            DELETE FROM lessons WHERE id = $1`, 
            [this.id]
        )
    }
}