import Database from "../connections";

export class Teacher {
    private _id?: number;
    public get id() {
        return this._id
    }
    private set id(newId: number|undefined) {
        this._id = newId
    }
    readonly user_id: number;
    public name: number;

    constructor(data: Teacher) {
        this.user_id = data.user_id
        this.name = data.name
    }

    async save() {
        if(this.id) {
            await Database.query(
                `UPDATE teachers
                SET name = $2
                WHERE id = $1`,
                [
                    this.id,
                    this.name
                ]
            )
            return this
        }else{
            const { rows } = await Database.query(
                `INSERT INTO teachers (user_id, name)
                VALUES ($1, $2)
                RETURNING id`,
                [
                    this.user_id,
                    this.name
                ]
            )
            this.id = rows[0].id
            return this
        }
    }

    static async findById(id: string) {
        const { rows } = await Database.query(
            `SELECT * FROM teachers WHERE id = $1`,
            [id]
        )
        if(rows.length === 0) return null
        
        const teacher = new Teacher(rows[0])
        teacher.id = rows[0].id
        
        return teacher
    }

    static async findByUser(userId: string) {
        const { rows } = await Database.query(
            `SELECT * FROM teachers WHERE user_id = $1`,
            [userId]
        )

        return rows.map(row => {
            const teacher = new Teacher(row)
            teacher.id = row.id
            return teacher
        })
    }

    async delete() {
        if(!this.id) return
        await Database.query(
            `DELETE FROM teachers WHERE id = $1`,
            [this.id]
        )
    }
}