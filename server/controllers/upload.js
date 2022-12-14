import jwt from "jsonwebtoken";
import {
  authenticateGoogle,
  downloadFromDrive,
  findUserDriveFolder,
  uploadToGoogleDrive,
} from "../gCloud/index.js";
import User from "../models/user.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    let decodedData;
    decodedData = jwt.decode(token);

    req.user = decodedData;
    next();
  } catch (error) {
    console.log(error);
  }
};

export const getuploadData = async (req, res) => {
  try {
    const { email, id: _id } = req.user;

    const existingUser = await User.findOne({ _id });

    if (!existingUser) return res.status(404).send("No User Found");

    const auth = authenticateGoogle();
    const id = existingUser?._id.valueOf();
    const data = await findUserDriveFolder(id, email, auth);

    return res.status(200).json({ existingUser });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong." });
  }
};

export const uploadFiles = async (req, res) => {
  try {
    if (!req.files) {
      res.status(400).send("No file uploaded.");
      return;
    }
    let uResponse = [];
    const { email, id: _id } = req.user;
    console.log("req.files", req.files);

    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).send("No User Found");
    const auth = authenticateGoogle();
    for (let file in req.files) {
      let response = await uploadToGoogleDrive(
        req.files[file],
        auth,
        email,
        _id,
        existingUser.folderId
      );
      uResponse.push(response);
    }
    console.log("uResponse", uResponse);

    const newUploads = uResponse.map((res, index) => ({
      fileId: res.id,
      name: res.name.substring(24),
      type: res.mimeType,
      fileSize: req.files[index].size,
    }));
    existingUser.uploads = [...existingUser.uploads, ...newUploads];

    await existingUser.save();
    return res.status(200).json({ existingUser });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong. Try Again" });
  }
};

export const downloadFile = async (req, res) => {
  console.log("body", req.body);
  const { fileName, fileId } = req.body;
  try {
    const auth = authenticateGoogle();
    // const { webContentLink } = await downloadFromDrive(fileId, auth);
    const result = await downloadFromDrive(fileId, fileName, auth);
    console.log("Dresult", result);
    // console.log("download", webContentLink);
    return res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong. Try Again" });
  }
};
