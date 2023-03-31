import {Router} from "express";
import {UserRecord} from "../records/user.record";
import {ValidationError} from "../utils/errors";
import {compare} from "bcrypt";

export const userRouter = Router();

userRouter
    .post('/login', async (req, res) => {

        const oneUser = await UserRecord.getOne(req.body.nickname);

        if (!req.body.nickname || !req.body.password) {
            res.status(400);
            throw new ValidationError('Formularz musi być wypełniony w całości!');
        }

        if (!oneUser) {
            res.status(404);
            throw new ValidationError('Nie ma użytkownika o podanej nazwie!');
        }

        if (await compare(req.body.password, oneUser.password)) {
            res.status(200);
            res.json(oneUser);
        } else {
            res.status(401);
            throw new ValidationError('Podano złe hasło!');
        }
    })

    .post('/register', async (req, res) => {

        if (await UserRecord.getOne(req.body.nickname)) {
            res.status(409);
            throw new ValidationError('Nazwa użytkownika jest zajęta!');
        } else {
            const newUser = new UserRecord(req.body);
            await newUser.insert();
            res.status(201);
            res.json(newUser);
        }
    });