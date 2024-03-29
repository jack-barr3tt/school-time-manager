import Database from "../connections";
import { APIError } from "../errors/types";

export default class Subject {
    private _id?: number
    public get id() {
        return this._id
    }
    private set id(id: number|undefined) {
        this._id = id
    }
    readonly user_id: number
    public name: string
    public color: number

    constructor(data: Subject) {
        this.id = data.id
        this.user_id = +data.user_id
        this.name = data.name
        this.color = data.color
    }

    async save() {
        if (this.id) {
            // If the subject has an id, it already exists in the database, so we update it
            await Database.query(
                'UPDATE subjects SET name = $1, color = $2 WHERE id = $3',
                [
                    this.name, 
                    this.color, 
                    this.id
                ]
            )
            return this
        }else {
            // Get existing subjects with this name and color to avoid duplicates
            const check = await Database.query(
                'SELECT * FROM subjects WHERE user_id = $1 AND name = $2',
                [this.user_id, this.name]
            )
            
            // If a subject already exists with this name and color, throw an error
            if(check.rows.length > 0) throw new APIError("Subject already exists", 400)

            // When the subject is created, we want to get it's id
            const { rows } = (await Database.query(
                'INSERT INTO subjects (user_id, name, color) VALUES ($1, $2, $3) RETURNING id',
                [
                    this.user_id, 
                    this.name, 
                    this.color
                ]
            ))
            this.id = rows[0].id
            return this
        }
    }

    static async findById(id: string, userId: string) {
        const { rows } = await Database.query(
            'SELECT * FROM subjects WHERE id = $1 AND user_id = $2',
            [id, userId]
        )
        if(rows.length === 0) return null
        
        const subject = new Subject(rows[0])
        subject.id = rows[0].id
        
        return subject
    }

    static async findByUser(userId: string) {
        const { rows } = await Database.query(
            `SELECT * FROM subjects WHERE user_id = $1`,
            [userId]
        )

        return rows.map(row => {
            let subject = new Subject(row)
            subject.id = row.id
            return subject
        })
    }

    async delete() {
        if(!this.id) return
        await Database.query(
            'DELETE FROM subjects WHERE id = $1',
            [this.id]
        )
    }
}