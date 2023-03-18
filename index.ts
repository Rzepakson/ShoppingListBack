import cors from "cors";
import express from "express";
import 'express-async-errors';
import {handleError} from "./utils/errors";
import rateLimit from "express-rate-limit";


const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100
}));

// app.use('/')

app.use(handleError);

app.listen(3001, 'localhost', () => {
    console.log('Listening on http://localhost:3001');
});