import Database from "../connections";

export class Repeat {
    private _id?: number;
    public get id() {
        return this._id
    }
    private set id(newId: number|undefined) {
        this._id = newId
    }
    readonly user_id: number;
    public name: string;
    public start_day: number;
    public end_day: number;
    public index: number;

    constructor(data: Repeat) {
        this.id = data.id
        this.user_id = data.user_id
        this.name = data.name
        this.start_day = data.start_day
        this.end_day = data.end_day
        this.index = data.index
    }

    async save() {
        if(this.id) {
            await Database.query(
                `UPDATE repeats
                SET name = $2, start_day = $3, end_day = $4, index = $5
                WHERE id = $1`,
                [
                    this.id,
                    this.name,
                    this.start_day,
                    this.end_day,
                    this.index
                ]
            )
            return this
        }else{
            let { rows: getRows } = await Database.query(
                `SELECT * from repeats WHERE user_id = $1`,
                [this.user_id]
            )

            const sortedRepeats = getRows.sort((a, b) => a.index - b.index)
            const newIndex = sortedRepeats.length > 0 ? sortedRepeats[sortedRepeats.length - 1].index + 1 : 0

            let { rows } = await Database.query(
                `INSERT INTO repeats (user_id, name, start_day, end_day, index)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id`,
                [
                    this.user_id,
                    this.name,
                    this.start_day,
                    this.end_day,
                    newIndex
                ]
            )

            await this.setRepeatReference()

            this.id = rows[0].id
            return this
        }
    }

    async setRepeatReference() {
        const { rows } = await Database.query(
            `SELECT id FROM repeats WHERE user_id = $1`,
            [this.user_id]
        )
        if(rows.length > 1) return

        const repeatId = rows[0].id

        await Database.query(
            `UPDATE users SET repeat_id = $2, repeat_ref = to_timestamp($3 / 1000.0) WHERE id = $1`,
            [
                this.user_id,
                repeatId,
                Date.now()
            ]
        )
    }

    static async findById(id: string) {
        const { rows } = await Database.query(
            `SELECT * FROM repeats WHERE id = $1`,
            [id]
        )
        if(rows.length === 0) return null
        
        const repeat = new Repeat(rows[0])
        repeat.id = rows[0].id
        
        return repeat
    }

    static async findByUser(userId: string) {
        const { rows } = await Database.query(
            `SELECT * FROM repeats WHERE user_id = $1`,
            [userId]
        )
             
        return rows.map(row => {
            let repeat = new Repeat(row)
            repeat._id = row.id
            return repeat
        })
    }

    async delete() {
        if(!this.id) return
        await Database.query(
            `DELETE FROM repeats WHERE id = $1`,
            [this.id]
        )
    }
}