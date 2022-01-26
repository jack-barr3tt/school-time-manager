import Database from "../connections";

export type BaseHomework = {
    id?: number;
    user_id: number;
    task: string;
    subject_id: number;
    due?: Date;
    difficulty?: number;
}

export default class Homework implements BaseHomework {
    private _id?: number;
    public get id() {
        return this._id
    }
    private set id(newId: number|undefined) {
        this._id = newId
    }
    
    readonly user_id: number;
    public task: string;
    public subject_id: number;
    public due?: Date;
    public difficulty?: number;

    constructor(data: BaseHomework) {  
        this.user_id = data.user_id;
        this.task = data.task;
        this.subject_id = data.subject_id;
        this.due = data.due;
        this.difficulty = data.difficulty;
    }

    async save() {
        if(this.id) {
            await Database.query(
                `UPDATE homeworks
                SET task = $2, subject_id = $3, due = $4, difficulty = $5 
                WHERE id = $1`, 
                [
                    this.id, 
                    this.task, 
                    this.subject_id, 
                    this.due, 
                    this.difficulty
                ]
            )
            return this
        } else {
            const { rows } = await Database.query(
                `INSERT INTO homeworks (user_id, task, subject_id, due, difficulty)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id`, 
                [
                    this.user_id, 
                    this.task, 
                    this.subject_id, 
                    this.due, 
                    this.difficulty
                ]
            )
            this.id = rows[0].id
            return this
        }
    }

    static async findById(id: string) {
        const { rows } = await Database.query(
            'SELECT * FROM homework WHERE id = $1',
            [id]
        );
        if(rows.length === 0) return null
        
        const subject = new Homework(rows[0])
        subject.id = rows[0].id;
        
        return subject
    }

    static async getByUser(userId: string) {
        const { rows } = await Database.query(
            'SELECT * FROM homework WHERE user_id = $1',
            [userId]
        );

        return rows.map(row => {
            
        })
    }

    async delete() {
        if(!this.id) return
        await Database.query(
            'DELETE FROM homeworks WHERE id = $1',
            [this.id]
        )
    }
}