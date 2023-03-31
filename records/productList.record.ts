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
    unit: string;
    listId: string;
    numbersAfterComma: number;

    constructor(obj: ProductListEntity) {

        if (obj.name.length === 0 || obj.count === 0) {
            throw new ValidationError('Formularz musi być wypełniony w całości!');
        }

        if (!((Number(obj.name)) <= 0 || !(Number(obj.name) >= 0))) {
            throw new ValidationError('Nazwa produktu nie może być liczbą!');
        }

        if (obj.name.length < 2 || obj.name.length > 20) {
            throw new ValidationError('Nazwa produktu musi być tekstem, którego długość wynosi od 2 do 20 znaków!');
        }

        if (typeof obj.count !== 'number') {
            throw new ValidationError('Ilość produktów musi być liczbą!');
        }

        if (obj.unit === 'szt' && obj.count % 1 !== 0) {
            throw new ValidationError('Jeśli podajesz ilość w sztukach to musisz podać liczbę całkowitą (bez przecinków)!')
        }

        if (obj.unit === 'szt' && obj.count < 1 || obj.count > 99) {
            throw new ValidationError('Liczba produktów musi być liczbą pomiędzy 1, a 99!');
        } else if (obj.count <= 0) {
            throw new ValidationError('Waga produktów musi być liczbą większą od 0 i mniejszą od 99!');
        }

        if (obj.numbersAfterComma > 2) {
            throw new ValidationError('Podana waga może zawierać maksymalnie dwie liczby po przecinku!');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.count = obj.count;
        this.unit = obj.unit;
        this.listId = obj.listId;
        this.numbersAfterComma = obj.numbersAfterComma;
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

    async insert(listId: string): Promise<void> {

        if (!this.id) {
            this.id = uuid();
        }

        if (!this.listId) {
            this.listId = listId;
        }

        await pool.execute('INSERT INTO `products_lists` VALUES(:id, :name, :count, :unit, :listId)', {
            id: this.id,
            name: this.name,
            count: this.count,
            unit: this.unit,
            listId: this.listId,
        });
    }

    async delete(): Promise<void> {
        await pool.execute('DELETE FROM `products_lists` WHERE `id` = :id', {
            id: this.id,
        });
    }
}

