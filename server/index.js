import * as dotenv from "dotenv";
dotenv.config();

import Express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.js";
import uploadRoutes from "./routes/upload.js";

const app = Express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/signin", userRoutes);
app.use("/upload", uploadRoutes);

const port = process.env.PORT || 5000;

const db_url = process.env.CONNECTION_URL;

mongoose.connect(db_url).then(() =>
  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  })
);
