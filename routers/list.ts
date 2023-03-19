import {Router} from "express";
import {ListRecord} from "../records/list.record";
import {ValidationError} from "../utils/errors";

export const listRouter = Router();

listRouter
    .get('/', async (req, res) => {
        const listsList = await ListRecord.listAll();
        res.json(listsList);
    })

    .get('/:id', async (req, res) => {
        const oneList = await ListRecord.getOne(req.params.id);

        res.json(oneList);
    })

    .post('/', async (req, res) => {
        const newList = new ListRecord(req.body);
        await newList.insert();

        res.json(newList);
    })

    .delete('/:id', async (req, res) => {
        const list = await ListRecord.getOne(req.params.id);

        if (!list) {
            throw new ValidationError('No such list!');
        }

        await list.delete();

        res.end();
    });
