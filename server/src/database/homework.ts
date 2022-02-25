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
    public due?: number;
    public duration?: number;
    public complete: boolean;

    constructor(data: HomeworkArgs) {  
        this.user_id = +data.user_id;
        this.task = data.task;
        this.subject = new Subject({ 
            id: data.subject_id,
            user_id: data.user_id,
            name: data.subject_name, 
            color: data.subject_color
        } as Subject);
        this.due = data.due && +data.due;
        this.duration = data.duration;
        this.complete = data.complete;
    }

    async save() {
        if(this.id) {
            await Database.query(
                `UPDATE homeworks
                SET task = $2, subject_id = $3, due = $4, duration = $5, complete = $6
                WHERE id = $1`, 
                [
                    this.id, 
                    this.task, 
                    this.subject.id, 
                    this.due, 
                    this.duration,
                    this.complete
                ]
            )
            return this
        } else {
            const { rows } = await Database.query(
                `INSERT INTO homeworks (user_id, task, subject_id, due, duration, complete)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id`, 
                [
                    this.user_id, 
                    this.task, 
                    this.subject.id, 
                    this.due, 
                    this.duration,
                    this.complete
                ]
            )
            this.id = rows[0].id
            return this
        }
    }

    static async findById(id: string, userId: string) {
        const { rows } = await Database.query(
            `SELECT h.id, h.user_id, h.task, h.subject_id, h.due, h.duration, h.complete, s.name subject_name, s.color subject_color 
            FROM homeworks h 
            INNER JOIN subjects s ON h.subject_id = s.id 
            WHERE h.id = $1 AND h.user_id = $2`,
            [id, userId]
        );
        if(rows.length === 0) return null
        
        const subject = new Homework(rows[0])
        subject.id = rows[0].id;
        
        return subject
    }

    static async getByUser(userId: string) {
        const { rows } = await Database.query(
            `SELECT h.id, h.user_id, h.task, h.subject_id, h.due, h.duration, h.complete, s.name subject_name, s.color subject_color 
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