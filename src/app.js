import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateRoute from "./routes/generate.js";
import path from "path";

dotenv.config({ path: "../.env" });

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/generate", generateRoute);

export default app;