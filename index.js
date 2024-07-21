import express from 'express';
import { config } from 'dotenv';
import path from 'path';
import * as allRouters from './src/Modules/index.routes.js';
import { DBconnection } from './DB/connection.js';

config({path : path.resolve('./config/config.env')});
const app = express();
const port = process.env.PORT;

app.use(express.json());
DBconnection();

app.use('/user' , allRouters.userRouter );
app.use('/task' , allRouters.taskRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))