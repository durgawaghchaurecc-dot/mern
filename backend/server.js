import express from 'express';
import dotenv from 'dotenv'
import todoRoutes from './routes/todo.route.js'
import { connectDB } from './config/db.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use("/api/todos", todoRoutes)

app.listen(5000, () => {
    console.log("server is started at http://localhost:5000");
});