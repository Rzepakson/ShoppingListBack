import cors from "cors";
import express, {json, Router} from "express";
import 'express-async-errors';
import {handleError, handleNotFoundError} from "./utils/errors";
import rateLimit from "express-rate-limit";
import {listRouter} from "./routers/list";
import {productListRouter} from "./routers/productList";
import {config} from "./config/config";


const app = express();

app.use(cors({
    origin: config.corsOrigin,
}));
app.use(json());
app.use(rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100
}));

const router = Router();

app.use('/api', router);

router.use('/list', listRouter);
router.use('/productList', productListRouter);

app.use(handleError);
app.use(handleNotFoundError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});