import Database from "../connections";
import { APIError } from "../errors/types";

export default class Subject {
    private _id?: number;
    public get id() {
        return this._id;
    }
    private set id(id: number|undefined) {
        this._id = id;
    }
    readonly user_id: number;
    public name: string;
    public color: number;

    constructor(data: Subject) {
        this.id = data.id;
        this.user_id = +data.user_id;
        this.name = data.name;
        this.color = data.color;
    }

    async save() {
        if (this.id) {
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
            const check = await Database.query(
                'SELECT * FROM subjects WHERE user_id = $1 AND name = $2',
                [this.user_id, this.name]
            );
            
            if(check.rows.length > 0) throw new APIError("Subject already exists", 400)

            const { rows } = (await Database.query(
                'INSERT INTO subjects (user_id, name, color) VALUES ($1, $2, $3) RETURNING id',
                [
                    this.user_id, 
                    this.name, 
                    this.color
                ]
            ))
            this.id = rows[0].id;
            return this
        }
    }

    static async findById(id: string) {
        const { rows } = await Database.query(
            'SELECT * FROM subjects WHERE id = $1',
            [id]
        );
        if(rows.length === 0) return null
        
        const subject = new Subject(rows[0])
        subject.id = rows[0].id;
        
        return subject
    }

    static async findByUser(userId: string) {
        const { rows } = await Database.query(
            `SELECT * FROM subjects WHERE user_id = $1`,
            [userId]
        );

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