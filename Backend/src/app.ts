import express from "express";
import cors from "cors";
import analyzeRoute from "./routes/analyze";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/analyze-logs", analyzeRoute);

export default app;