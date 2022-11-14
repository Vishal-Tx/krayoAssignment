import { google } from "googleapis";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Readable } from "stream";
import fs from "fs";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const authenticateGoogle = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: `${__dirname}/krayoassignment-368315-0895206469a9.json`,
    scopes: "https://www.googleapis.com/auth/drive",
  });
  return auth;
};

export const uploadToGoogleDrive = async (files, auth, email, id, folderId) => {
  // const fileMetadata = {
  //   name: file.originalname,
  //   parents: ["1nGcz-RQKk1U9-xXUZI1jUxxsRYMISNBg"], // Change it according to your desired parent folder id
  // };

  let buffetToStream = (buffer) => {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  };

  const service = google.drive({ version: "v3", auth });
  const fileMetadata = {
    name: `${id}${files.originalname}`,
    parents: [folderId],
  };
  const media = {
    mimeType: files.mimetype,
    // body: fs.createReadStream("files.buffer"),
    body: buffetToStream(files.buffer),
  };
  try {
    const file = await service.files.create({
      resource: fileMetadata,
      media: media,
    });
    // console.log("File Id:", file);
    return file.data;
  } catch (error) {
    console.log(error);
  }
};

export const createDriveFolder = async (id, auth) => {
  const service = google.drive({ version: "v3", auth });
  const fileMetadata = {
    name: id,
    mimeType: "application/vnd.google-apps.folder",
    parents: ["1nGcz-RQKk1U9-xXUZI1jUxxsRYMISNBg"],
  };
  try {
    const file = await service.files.create({
      resource: fileMetadata,
      fields: "id",
    });
    console.log("Folder Id:", file.data.id);
    return file.data.id;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
};

export const findUserDriveFolder = async (id, email, auth) => {
  const service = google.drive({ version: "v3", auth });

  const files = [];
  try {
    const res = await service.files.list({
      q: `name contains '${id}' and mimeType != 'application/vnd.google-apps.folder'`,
    });
    Array.prototype.push.apply(files, res.files);
    res.data.files.forEach(function (file) {
      console.log("Found file:", file.name, file.id);
    });
    return res.data.files;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
