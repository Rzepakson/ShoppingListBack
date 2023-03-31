import {v4 as uuid} from "uuid";
import {ListEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

export type ListRecordResults = [ListRecord[], FieldPacket[]];

export class ListRecord implements ListEntity {
    id?: string;
    name: string;
    createdAt: string;
    userId: string;

    constructor(obj: ListEntity) {

        if (!obj.name) {
            throw new ValidationError('Nazwa listy nie może być pusta!');
        }

        if (!((Number(obj.name)) <= 0 || !(Number(obj.name) >= 0))) {
            throw new ValidationError('Nazwa listy nie może być liczbą!');
        }

        if (obj.name.length < 2 || obj.name.length > 20) {
            throw new ValidationError('Nazwa listy musi mieć długość od 2 do 20 znaków!');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.createdAt = obj.createdAt;
        this.userId = obj.userId;
    }

    static async listAll(userId: string): Promise<ListRecord[]> {
        const [results] = (await pool.execute('SELECT * FROM `lists` WHERE `userId` = :userId ORDER BY `name` ASC', {
            userId,
        })) as ListRecordResults;
        return results.map((obj) => new ListRecord(obj));
    }

    static async getOne(id: string): Promise<ListRecord> | null {
        const [results] = (await pool.execute('SELECT * FROM `lists` WHERE `id` = :id', {
            id,
        })) as ListRecordResults;
        return results.length === 0 ? null : new ListRecord(results[0]);
    }

    async insert(userId: string): Promise<void> {
        if (!this.id) {
            this.id = uuid();
        }

        if (!this.createdAt) {
            this.createdAt = new Date().toLocaleString("sv-SE");
        }

        await pool.execute('INSERT INTO `lists` VALUES(:id, :name, :createdAt, :userId)', {
            id: this.id,
            name: this.name,
            createdAt: this.createdAt,
            userId,
        });
    }

    async delete(): Promise<void> {
        await pool.execute('DELETE FROM `lists` WHERE `id` = :id', {
            id: this.id,
        });
    }
}