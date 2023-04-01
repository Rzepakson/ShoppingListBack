import {v4 as uuid} from "uuid";
import {UserEntity} from "../types/user";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {ValidationError} from "../utils/errors";
import {hashSync} from "bcrypt";

export type UserRecordResults = [UserRecord[], FieldPacket[]];


export class UserRecord implements UserEntity {
    id?: string;
    nickname: string;
    password: string;

    constructor(obj: UserEntity) {

        if (!obj.nickname || !obj.password) {
            throw new ValidationError('Formularz musi być wypełniony w całości!');
        }

        if (obj.nickname.length < 2 || obj.nickname.length > 255) {
            throw new ValidationError('Nazwa użytkownika może mieć od 2 do 255 znaków!');
        }

        if (obj.password.length < 8 || obj.password.length > 60) {
            throw new ValidationError('Hasło musi mieć minimum 8 znaków i nie więcej niż 60!');
        }

        this.id = obj.id;
        this.nickname = obj.nickname;
        this.password = obj.password;
    }

    static async getOne(nickname: string): Promise<UserRecord> | null {
        const [results] = (await pool.execute('SELECT * FROM `users` WHERE `nickname` = :nickname', {
            nickname,
        })) as UserRecordResults;
        return results.length === 0 ? null : new UserRecord(results[0]);
    }

    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }

        await pool.execute('INSERT INTO `users` VALUES(:id, :nickname, :password)', {
            id: this.id,
            nickname: this.nickname,
            password: hashSync(this.password, 10),
        });

        return this.id;
    }
}