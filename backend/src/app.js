import express from "express";
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import router from "./routes/index.js";
import notFound from "./middlewares/notFound.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const uploadsPath = path.join(__dirname, 'assets', 'uploads');
app.use('/assets/uploads', express.static(uploadsPath));

app.use("/marsai", router);
app.use(notFound);

export default app;
