import Database from "../connections";

export class TimetabledDays {
    private _id?: number;
    public get id() {
        return this._id
    }
    private set id(newId: number|undefined) {
        this._id = newId
    }
    readonly user_id: number;
    public repeat_id: number;
    public day: number;

    constructor (data: TimetabledDays) {
        this.user_id = data.user_id
        this.repeat_id = data.repeat_id
        this.day = data.day
    }

    async save() {
        if(this.id) {
            await Database.query(
                `UPDATE timetabled_days
                SET repeat_id = $2, day = $3
                WHERE id = $1`,
                [
                    this.id,
                    this.repeat_id,
                    this.day
                ]
            )
            return this
        }else{
            const { rows } = await Database.query(
                `INSERT INTO timetabled_days (user_id, repeat_id, day)
                VALUES ($1, $2, $3)
                RETURNING id`,
                [
                    this.user_id,
                    this.repeat_id,
                    this.day
                ]
            )
            this.id = rows[0].id
            return this
        }
    }

    static async findById(id: string) {
        const { rows } = await Database.query(
            `SELECT * FROM timetabled_days WHERE id = $1`,
            [id]
        )
        if(rows.length === 0) return null
        
        const timetabled_days = new TimetabledDays(rows[0])
        timetabled_days.id = rows[0].id
        
        return timetabled_days
    }

    static async findByUser(userId: string) {
        const { rows } = await Database.query(
            `SELECT * FROM timetabled_days WHERE user_id = $1`,
            [userId]
        )

        return rows.map(row => {
            const timetabled_days = new TimetabledDays(row)
            timetabled_days.id = row.id
            return timetabled_days
        })
    }

    async delete() {
        if(!this.id) return null
        await Database.query(
            `DELETE FROM timetabled_days WHERE id = $1`,
            [this.id]
        )
        return this
    }
}