import cors from "cors";
import express from "express";
import 'express-async-errors';


const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());

app.use('/')

app.listen(3001, 'localhost', () => {
    console.log('Listening on http://localhost:3001');
});