import {Router} from "express";
import {ListRecord} from "../records/list.record";

export const listRouter = Router();

listRouter
    .get('/:userId', async (req, res) => {
        const listsList = await ListRecord.listAll(req.params.userId);

        res.status(200);
        res.json(listsList);
    })

    .get('/:listId', async (req, res) => {
        const oneList = await ListRecord.getOne(req.params.listId);

        res.status(200);
        res.json(oneList);
    })

    .post('/:userId', async (req, res) => {
        const newList = new ListRecord(req.body);
        await newList.insert(req.params.userId);

        res.status(201);
        res.json(newList);
    })

    .delete('/:listId', async (req, res) => {
        const list = await ListRecord.getOne(req.params.listId);
        await list.delete();

        res.status(204);
        res.json(list);
    });
