import {Router} from "express";
import {ProductListRecord} from "../records/productList.record";
import {NotFoundError} from "../utils/errors";

export const productListRouter = Router();

productListRouter
    .get('/:listId', async (req, res) => {
        const productsList = await ProductListRecord.listAll(req.params.listId);

        res.json(productsList);
    })

    .post('/:listId', async (req, res) => {
        const newProduct = new ProductListRecord(req.body);
        await newProduct.insert(req.params.listId);

        res.json(newProduct);
    })

    .delete('/:listId/:id', async (req, res) => {
        const productsList = await ProductListRecord.getOne(req.params.id);

        if (!productsList) {
            throw new NotFoundError('Produkt, który chcesz usunąć nie istnieje!');
        }

        await productsList.delete();

        res.json(productsList);
    });