import { hash } from "bcrypt"
import Database from "../connections";
import { APIError } from "../errors/types";

export type BaseUser = {
    id?: number;
    username: string;
    email: string;
}

export class User implements BaseUser {
    private _id? : number;
    public get id() {
        return this._id
    }
    private set id(newId : number|undefined) {
        this._id = newId
    }
    readonly email : string;
    readonly username : string;
    private hash? : string;

    constructor(data: BaseUser) {
        let emailValidationRegex = /.+@.+\..+/g
        if(emailValidationRegex.test(data.email))
            this.email = data.email;
        else
            throw new APIError("Invalid email", 400)
        this.username = data.username;
    }

    async save() {
        if(this.id) {
            await Database.query(
                'UPDATE users SET username = $1, email = $2 WHERE id = $3',
                [
                    this.username, 
                    this.email, 
                    this.id
                ]
            )
            return this
        } else {
            const { rows } = await Database.query(
                'INSERT INTO users (email, username, hash) VALUES ($1, $2, $3) RETURNING id',
                [
                    this.email,
                    this.username,
                    this.hash
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
            'SELECT id, username, email FROM users WHERE id = $1',
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