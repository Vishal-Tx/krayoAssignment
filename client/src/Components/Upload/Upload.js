import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadAuth, uploadFiles } from "../../features/API/Index";
import UploadFIle from "./UploadFile/UploadFIle";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";

const Upload = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [files, setFiles] = useState(null);
  const inputRef = useRef(null);
  useEffect(() => {
    async function fetchUser() {
      if (user?.token) {
        const uploadedData = await uploadAuth(user);
        console.log("uploadRes", uploadedData);
        if (uploadedData) {
          setUserData(uploadedData.existingUser);
          setIsLoading(false);
        }
      } else {
        navigate("/");
      }
    }
    fetchUser();
  }, [navigate, user]);

  console.log("userData", userData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData();
    for (let file in files) {
      formData.append("fileUpload", files[file]);
    }

    const { existingUser: data } = await uploadFiles(formData);
    toast.success(`File Uploaded Successfully!`, {
      theme: "colored",
      autoClose: 3000,
    });
    console.log("data", data);
    setUserData(data);
    setIsLoading(false);
    inputRef.current = null;
  };

  const handleChange = async (e) => {
    const { files } = e.target;
    const data = () => {
      let uFile = [];
      for (let i = 0; i < files.length; i++) {
        uFile.push(files[i]);
      }
      return uFile;
    };
    const fData = data();
    setFiles(fData);
  };

  return isLoading ? (
    <div className=" flex justify-center mt-40 ">
      <ReactLoading
        type="bubbles"
        color="rgb(34 211 238)"
        height={80}
        width={80}
      />
    </div>
  ) : (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center flex-wrap items-center mt-10 max-[340px]:m-4"
      >
        <input
          id="fileUpload"
          name="fileUpload"
          type="file"
          multiple
          ref={inputRef}
          accept="all"
          onChange={handleChange}
          required
        />
        <button className="bg-cyan-400 rounded p-3 hover:bg-cyan-600 active:bg-cyan-800 max-[423px]:m-4">
          Upload
        </button>
      </form>

      {userData.uploads ? (
        <div className="grid max-[650px]:grid-cols-2 max-[1200px]:grid-cols-3 grid-cols-6 gap-4 mt-10 mx-4">
          {userData.uploads.map((file, index) => (
            <UploadFIle key={index} file={file} setIsLoading={setIsLoading} />
          ))}
        </div>
      ) : (
        <div className=" flex justify-center mt-20">
          <ReactLoading type="bubbles" color="blue" height={60} width={60} />
        </div>
      )}
    </div>
  );
};

export default Upload;
