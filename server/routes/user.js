import express from "express";

import { signin } from "../controllers/user.js";

const router = express.Router();
router.post("/", signin);

export default router;
