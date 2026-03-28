import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { getHelmetConfig } from "../config/helmetConfig";
import { getCorsOptions } from "../config/corsConfig";
import morgan from "morgan";
import eventRoutes from "./api/v1/routes/eventRoutes";




// Initialize Express application
const app = express();

app.use(getHelmetConfig());

app.use(cors(getCorsOptions()));

app.use(morgan("combined"));
app.use(express.json());

app.use("/api/v1", eventRoutes);


export default app;
