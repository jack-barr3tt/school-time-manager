import Database from "../connections";
import { LessonBlock } from "./lesson_block";
import { Location } from "./location";
import { Repeat } from "./repeats";
import Subject from "./subjects";
import { Teacher } from "./teacher";

type LessonArgs = Lesson & {
    subject_name: string;
    subject_color: number;
    block_name: string;
    block_start_time: Date;
    block_end_time: Date;
    location_name: string;
    teacher_name: string;
    repeat_name: string;
    repeat_start_day: number;
    repeat_end_day: number;
}

export class Lesson {
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

    public get block_id() {
        return this.block.id
    }
    public set block_id(newId: number|undefined) {
        this.block = { id: newId } as LessonBlock
    }

    public get location_id() {
        return this.location.id
    }
    public set location_id(newId: number|undefined) {
        this.location = { id: newId } as Location
    }

    public get teacher_id() {
        return this.teacher.id
    }
    public set teacher_id(newId: number|undefined) {
        this.teacher = { id: newId } as Teacher
    }

    public get repeat_id() {
        return this.repeat.id
    }
    public set repeat_id(newId: number|undefined) {
        this.repeat = { id: newId } as Repeat
    }

    readonly user_id: number;
    public subject: Subject;
    public block: LessonBlock;
    public location: Location;
    public teacher: Teacher;
    public repeat: Repeat;
    public day: number;

    constructor (data: LessonArgs) {
        this.user_id = data.user_id
        this.subject = new Subject({ 
            id: data.subject_id,
            user_id: data.user_id,
            name: data.subject_name, 
            color: data.subject_color
        } as Subject)

        this.block = new LessonBlock({
            id: data.block_id,
            user_id: data.user_id,
            name: data.block_name,
            start_time: data.block_start_time,
            end_time: data.block_end_time
        } as LessonBlock)

        this.location = new Location({
            id: data.location_id,
            user_id: data.user_id,
            name: data.location_name
        } as Location)

        this.teacher = new Teacher({
            id: data.teacher_id,
            user_id: data.user_id,
            name: data.location_name
        } as Teacher)

        this.repeat = new Repeat({
            id: data.repeat_id,
            user_id: data.user_id,
            name: data.repeat_name,
            start_day: data.repeat_start_day,
            end_day: data.repeat_end_day
        } as Repeat)

        this.day = data.day
    }

    async save() {
        if(this.id) {
            await Database.query(`
                UPDATE lessons
                SET user_id = $2, subject_id = $3, block_id = $4, location_id = $5, teacher_id = $6, day = $7
                WHERE id = $1
                `, [
                    this.id,
                    this.user_id,
                    this.subject_id,
                    this.block_id,
                    this.location_id,
                    this.teacher_id,
                    this.day
                ]
            )
            return this
        }else{
            const { rows } = await Database.query(`
                INSERT INTO lessons (user_id, subject_id, block_id, location_id, teacher_id, day)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
                `, [
                    this.user_id,
                    this.subject_id,
                    this.block_id,
                    this.location_id,
                    this.teacher_id,
                    this.day
                ]
            )
            this.id = rows[0].id
            return this
        }
    }

    static async findById(id: string, userId: string) {
        const { rows } = await Database.query(
            `SELECT l.*, s.name subject_name, s.color subject_color, b.name block_name, b.start_time block_start_time, b.end_time block_end_time, lo.name location_name, t.name teacher_name
            FROM lessons l
            INNER JOIN subjects s ON l.subject_id = s.id
            INNER JOIN lesson_blocks b ON l.block_id = b.id
            INNER JOIN locations lo ON l.location_id = lo.id
            INNER JOIN teachers t ON l.teacher_id = t.id  
            WHERE l.id = $1 AND l.user_id = $2`, 
            [id, userId]
        )
        if(rows.length === 0) return null
        
        const lesson = new Lesson(rows[0])
        lesson.id = rows[0].id
        
        return lesson
    }

    static async findByUser(userId: string) {
        const { rows } = await Database.query(
            `SELECT l.*, s.name subject_name, s.color subject_color, b.name block_name, b.start_time block_start_time, b.end_time block_end_time, lo.name location_name, t.name teacher_name
            FROM lessons l
            INNER JOIN subjects s ON l.subject_id = s.id
            INNER JOIN lesson_blocks b ON l.block_id = b.id
            INNER JOIN locations lo ON l.location_id = lo.id
            INNER JOIN teachers t ON l.teacher_id = t.id  
            WHERE l.user_id = $1`,
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