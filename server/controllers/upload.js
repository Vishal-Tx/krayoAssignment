import jwt from "jsonwebtoken";
import {
  authenticateGoogle,
  findUserDriveFolder,
  uploadToGoogleDrive,
} from "../gCloud/index.js";
import User from "../models/user.js";

export const auth = async (req, res, next) => {
  //   console.log("req.headersupload", req.headers);
  //   console.log("req.body", req.body);
  //   console.log("1234");
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
  // console.log("req.user", req.user);
  const { email, id: _id } = req.user;

  const existingUser = await User.findOne({ _id });

  const auth = authenticateGoogle();
  // console.log("existingUser._id", existingUser._id.valueOf());
  const id = existingUser?._id.valueOf();
  const data = await findUserDriveFolder(id, email, auth);
  console.log("folderData", data);
  // data.map((da) => {
  //   console.log(da.name.substring(24));
  // });
  // existingUser.uploads.map(upload=>{
  //   data.forEach(da=>{
  //     if(upload.name===da.name.substring(24))
  //     upload.fileId =
  //   })
  // })

  res.status(200).json({ existingUser });
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
  }
};

export const downloadFile = (req, res)=>{
  
}