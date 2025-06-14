import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import { connectDB } from "./config/database.js";

dotenv.config();
connectDB();

const port = process.env.PORT || 5000;
const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
