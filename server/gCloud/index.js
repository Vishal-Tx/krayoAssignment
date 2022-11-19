import { google } from "googleapis";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { Readable } from "stream";
import * as fs from "fs";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const authenticateGoogle = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: `${__dirname}/krayoassignment-368315-0895206469a9.json`,
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.appdata",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.metadata",
      "https://www.googleapis.com/auth/drive.metadata.readonly",
      "https://www.googleapis.com/auth/drive.photos.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
  });
  return auth;
};

export const uploadToGoogleDrive = async (files, auth, email, id, folderId) => {
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
    body: buffetToStream(files.buffer),
  };
  try {
    const file = await service.files.create({
      resource: fileMetadata,
      media: media,
    });
    console.log("ufile", file);
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
    res.data.files.forEach(function (file) {});
    return res.data.files;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// export const downloadFromDrive = async (fileId, auth) => {
//   const service = google.drive({ version: "v3", auth });

//   try {
//     await service.permissions.create({
//       fileId: fileId,
//       requestBody: {
//         role: "reader",
//         type: "anyone",
//       },
//     });
//     const result = await service.files.get({
//       fileId: fileId,
//       fields: "webViewLink, webContentLink",
//     });
//     console.log("result.data", result.data);
//     return result.data;
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

export const downloadFromDrive = async (fileId, fileName, auth) => {
  const service = google.drive({ version: "v3", auth });

  try {
    const file = await service.files
      .get(
        {
          fileId: fileId,
          alt: "media",
        },
        { responseType: "stream" }
      )
      .then((res) => {
        return new Promise((resolve, reject) => {
          const filePath = path.join(`${os.homedir()}/Downloads`, fileName);
          console.log(`writing to ${filePath}`);
          const dest = fs.createWriteStream(filePath);

          res.data
            .on("end", () => {
              console.log("Done downloading file.");
              resolve(filePath);
            })
            .on("error", (err) => {
              console.error("Error downloading file.");
              reject(err);
            })

            .pipe(dest);
        });
      });
    return file;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
