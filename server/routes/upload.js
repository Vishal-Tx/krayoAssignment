import express from "express";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import {
  auth,
  getuploadData,
  uploadFiles,
  downloadFile,
} from "../controllers/upload.js";

const router = express.Router();
router
  .route("/")
  .post(auth, getuploadData)
  .patch(auth, upload.array("fileUpload"), uploadFiles);

router.post("/download", auth, downloadFile);

export default router;
