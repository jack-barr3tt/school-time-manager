import { hash } from "bcrypt"
import Database from "../connections";
import { APIError } from "../errors/types";

export class User {
    private _id? : number;
    public get id() {
        return this._id
    }
    private set id(newId : number|undefined) {
        this._id = newId
    }
    readonly email : string;
    readonly username : string;
    public prewarning? : number;
    private hash? : string;

    constructor(data: User) {
        let emailValidationRegex = /.+@.+\..+/g
        if(emailValidationRegex.test(data.email))
            this.email = data.email;
        else
            throw new APIError("Invalid email", 400)
        this.username = data.username;
        this.prewarning = data.prewarning;
    }

    async save() {
        if(this.id) {
            await Database.query(
                'UPDATE users SET username = $1, email = $2, prewarning = $3 WHERE id = $4',
                [
                    this.username, 
                    this.email,
                    this.prewarning,
                    this.id
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
            'SELECT id, username, email, prewarning FROM users WHERE id = $1',
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