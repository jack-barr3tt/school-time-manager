import Database from "../connections";
import Subject from "./subjects";

type HomeworkArgs = Homework & {
    subject_id: number,
    subject_name: string, 
    subject_color: number,
}

export default class Homework {
    private _id?: number;
    public get id() {
        return this._id
    }
    private set id(newId: number|undefined) {
        this._id = newId
    }

    public get subject_id() {
        return this.subject.id
    }
    public set subject_id(newId: number|undefined) {
        this.subject = { id: newId } as Subject
    }
    
    readonly user_id: number;
    public task: string;
    public subject: Subject;
    public due?: Date;
    public difficulty?: number;

    constructor(data: HomeworkArgs) {  
        this.user_id = data.user_id;
        this.task = data.task;
        this.subject = new Subject({ 
            id: data.subject_id,
            user_id: data.user_id,
            name: data.subject_name, 
            color: data.subject_color
        } as Subject);
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
                    this.subject.id, 
                    this.due, 
                    this.difficulty
                ]
            )
            return this
        } else {
            const { rows } = await Database.query(
                `INSERT INTO homeworks (user_id, task, subject_id, due, difficulty)
                VALUES ($1, $2, $3, to_timestamp($4), $5)
                RETURNING id`, 
                [
                    this.user_id, 
                    this.task, 
                    this.subject.id, 
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
            'SELECT * FROM homeworks WHERE id = $1',
            [id]
        );
        if(rows.length === 0) return null
        
        const subject = new Homework(rows[0])
        subject.id = rows[0].id;
        
        return subject
    }

    static async getByUser(userId: string) {
        const { rows } = await Database.query(
            `SELECT h.id, h.user_id, h.task, h.subject_id, h.due, h.difficulty, s.name subject_name, s.color subject_color 
            FROM homeworks h 
            INNER JOIN subjects s ON h.subject_id = s.id 
            WHERE h.user_id = $1`,
            [userId]
        );

        return rows.map(row => {
            let homework = new Homework(row)
            homework.id = row.id
            return homework
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