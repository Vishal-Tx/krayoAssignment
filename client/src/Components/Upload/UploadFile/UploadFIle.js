import React from "react";
import { downloadFile } from "../../../features/API/Index";
import doc from "../../../assets/doc.png";
import pdf from "../../../assets/pdf.png";
import photo from "../../../assets/photo.png";
import audio from "../../../assets/speaker-filled-audio-tool.png";
import video from "../../../assets/video.png";
import unknown from "../../../assets/unknown.png";
import * as dayjs from "dayjs";
import { toast } from "react-toastify";

const UploadFIle = ({ file }) => {
  console.log("file", file);
  const handleDownload = async (fileId, fileName) => {
    try {
      console.log("fileId", fileId);
      const dData = {
        fileId,
        fileName,
      };
      const data = await downloadFile(dData);
      window.open(data.webContentLink);
      toast.success(`File Downloaded Successfully!`, { theme: "colored" });
      console.log("dFile", data);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };
  let img;
  switch (file.type) {
    case "image/jpeg":
    case "image/webp":
    case "image/png":
      img = photo;
      break;
    case "application/pdf":
      img = pdf;
      break;

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      img = doc;
      break;
    case "video/mp4":
      img = video;
      break;
    case "":
      img = audio;
      break;
    default:
      img = unknown;
      break;
  }
  const { fileSize } = file;
  let size;
  function sizeConverter(fileSize) {
    let file = fileSize / 1024;
    if (file <= 1024) {
      size = `${file.toFixed(2)} KB`;
      return size;
    }
    if (file > 1024) {
      file = file / 1024;
      if (file < 1024) {
        size = `${file.toFixed(2)} MB`;
        return size;
      }
      if (file > 1024) {
        size = `${file.toFixed(2)} GB`;
        return size;
      }
    }
  }
  sizeConverter(fileSize);

  return (
    <div
      className="shadow-lg hover:shadow-2xl border-2 h-auto p-3"
      onClick={() => {
        handleDownload(file.fileId, file.name);
      }}
    >
      <img src={img} alt="..." className="w-56 h-40 mx-auto pb-3"></img>
      <p className="">{file.name}</p>
      <p className="font-semibold">size: {size}</p>
      <p className="font-medium">
        Uploaded At:{" "}
        {dayjs(file.uploadedAt).format(`hh:mm A, dddd, DD-MM-YYYY`)}
      </p>
    </div>
  );
};

export default UploadFIle;
