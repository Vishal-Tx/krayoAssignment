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

const UploadFIle = ({ file, setIsLoading }) => {
  console.log("file", file);
  const handleDownload = async (fileId, fileName) => {
    try {
      // console.log("fileId", fileId);
      setIsLoading(true);
      const dData = {
        fileId,
        fileName,
      };
      const { result } = await downloadFile(dData);
      // window.open(data.webContentLink);
      if (result) {
        toast.success(`File Downloaded Successfully at ${result}`, {
          theme: "colored",
          autoClose: 6000,
        });
      } else {
        toast.error("something went wrong.Please try Again!");
      }
      setIsLoading(false);
      console.log("dFile", result);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong", {
        autoClose: 3000,
      });
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
      className="shadow-lg hover:shadow-2xl border-2  p-3"
      onClick={() => {
        handleDownload(file.fileId, file.name);
      }}
    >
      <img src={img} alt="..." className="w-20 h-20 mx-auto pb-3"></img>
      <p className="truncate" title={file.name}>
        {file.name}
      </p>
      <p className="font-semibold">size: {size}</p>
      <p className="font-medium">
        Uploaded At:{" "}
        {dayjs(file.uploadedAt).format(`hh:mm A, dddd, DD-MM-YYYY`)}
      </p>
    </div>
  );
};

export default UploadFIle;
