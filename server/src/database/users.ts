import { hash } from "bcrypt"
import Database from "../connections";
import { APIError } from "../errors/types";
import { Repeat } from "./repeats";

type UserArgs = User & {
    repeat_name: string;
    repeat_start_day: number;
    repeat_end_day: number;
}

export class User {
    private _id? : number;
    public get id() {
        return this._id
    }
    private set id(newId : number|undefined) {
        this._id = newId
    }

    public get repeat_id() {
        return this.repeat && this.repeat.id
    }
    public set repeat_id(newId: number|undefined) {
        this.repeat = { id: newId } as Repeat
    }
    readonly email : string;
    readonly username : string;
    public prewarning? : number;
    public repeat?: Repeat;
    public repeat_ref?: Date;
    private hash? : string;

    constructor(data: UserArgs) {
        let emailValidationRegex = /.+@.+\..+/g
        if(emailValidationRegex.test(data.email))
            this.email = data.email;
        else
            throw new APIError("Invalid email", 400)
        this.username = data.username;
        this.prewarning = data.prewarning;
        if(data.repeat_name) this.repeat = new Repeat({
            id: data.repeat_id,
            name: data.repeat_name,
            start_day: data.repeat_start_day,
            end_day: data.repeat_end_day
        } as Repeat)
        this.repeat_ref = data.repeat_ref ? new Date(data.repeat_ref) : new Date()
    }

    async save() {
        if(this.id) {
            await Database.query(
                'UPDATE users SET username = $2, email = $3, prewarning = $4, repeat_ref = to_timestamp($5 / 1000.0), repeat_id = $6 WHERE id = $1',
                [
                    this.id,
                    this.username, 
                    this.email,
                    this.prewarning,
                    this.repeat_ref,
                    this.repeat_id
                ]
            )
            return this
        } else {
            const { rows } = await Database.query(
                'INSERT INTO users (email, username, hash, prewarning) VALUES ($1, $2, $3, $4) RETURNING id',
                [
                    this.email,
                    this.username,
                    this.hash,
                    this.prewarning
                ]
            )
            this.id = rows[0].id
            return this
        }
    }

    async addPassword(password?: string) {
        if(!password) throw new APIError("Password is required", 400)
        const hashedPassword = await hash(password, 10)
        this.hash = hashedPassword
    }

    static async findById(id: string|number) {
        const { rows } = await Database.query(
            `SELECT u.id, u.username, u.email, u.prewarning, u.repeat_id, u.repeat_ref, r.name repeat_name, r.start_day repeat_start_day, r.end_day repeat_end_day
            FROM users u
            LEFT JOIN repeats r ON u.repeat_id = r.id
            WHERE u.id = $1`,
            [id]
        )

        if(rows.length === 0) return null

        const user = new User(rows[0])
        user.id = rows[0].id

        return user
    }

    async delete() {
        if(!this.id) return
        await Database.query(
            'DELETE FROM users WHERE id = $1',
            [this.id]
        )
    }
}