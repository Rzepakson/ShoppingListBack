import {v4 as uuid} from "uuid";
import {ProductListEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type ProductRecordResults = [ProductListRecord[], FieldPacket[]];

export class ProductListRecord implements ProductListEntity {
    id?: string;
    name: string;
    count: number;
    listId: string;

    constructor(obj: ProductListEntity) {
        if (!obj.name || obj.name.length < 2 || obj.name.length > 20 || typeof obj.name !== 'string') {
            throw new ValidationError('Nazwa produktu musi być tekstem, którego długość wynosi od 2 do 20 znaków.');
        }

        if (!obj.count || obj.count < 0 || obj.count > 99 || typeof obj.count !== 'number') {
            throw new ValidationError('Liczba produktów musi być liczbą pomiędzy 1, a 99.');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.count = obj.count;
        this.listId = obj.listId;
    }

    static async listAll(listId: string): Promise<ProductListRecord[]> {
        const [results] = (await pool.execute('SELECT * FROM `products_lists` WHERE `listId` = :listId ORDER BY `name` ASC', {
            listId,
        })) as ProductRecordResults;
        return results.map((obj) => new ProductListRecord(obj));
    }

    static async getOne(id: string): Promise<ProductListRecord> | null {
        const [results] = (await pool.execute('SELECT * FROM `products_lists` WHERE `id` = :id', {
            id,
        })) as ProductRecordResults;
        return results.length === 0 ? null : new ProductListRecord(results[0]);
    }

    async insert(listId: string): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }

        if (!this.listId) {
            this.listId = listId;
        }

        await pool.execute('INSERT INTO `products_lists` VALUES(:id, :name, :count, :listId)', {
            id: this.id,
            name: this.name,
            count: this.count,
            listId: this.listId,
        });

        return this.id;
    }

    async delete(): Promise<void> {
        await pool.execute('DELETE FROM `products_lists` WHERE `id` = :id', {
            id: this.id,
        });
    }

    async update(): Promise<void> {
        await pool.execute('UPDATE `products_lists` SET `name` = :name, `listName` = :listName WHERE `id` = :id', {
            id: this.id,
            name: this.name,
            listId: this.listId,
        });
    }
}

