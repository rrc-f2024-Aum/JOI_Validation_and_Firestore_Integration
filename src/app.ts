import dotenv from "dotenv";
dotenv.config();

import { getHelmetConfig } from "../config/helmetConfig";
import express from "express";
import morgan from "morgan";
import eventRoutes from "./api/v1/routes/eventRoutes";




// Initialize Express application
const app = express();

app.use(getHelmetConfig());
app.use(morgan("combined"));
app.use(express.json());

app.use("/api/v1", eventRoutes);


export default app;
