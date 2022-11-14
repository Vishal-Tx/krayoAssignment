import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  downloadFile,
  uploadAuth,
  uploadFiles,
} from "../../features/API/Index";

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

  // console.log("userData", userData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log("files", files);

    let formData = new FormData();
    for (let file in files) {
      formData.append("fileUpload", files[file]);
    }

    // console.log("formData", formData);
    const { existingUser: data } = await uploadFiles(formData);
    console.log("data", data);
    setUserData(data);
    setIsLoading(false);
    inputRef.current.value = null;
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

  const handleDownload = async (name, fileId) => {
    try {
      const data = await downloadFile(name, fileId, user.folderId);
      console.log("dFile", data);
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading ? (
    "Loading..."
  ) : (
    <div>
      <p>{userData.name}</p>
      <p>{userData.email}</p>
      <form onSubmit={handleSubmit}>
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
        <button>Upload</button>
      </form>

      {userData.uploads ? (
        <div>
          {userData.uploads.map((file, index) => {
            return (
              <p
                key={index}
                onClick={() => {
                  handleDownload(file.name, file.fileId);
                }}
              >
                {file.name}
              </p>
            );
          })}
        </div>
      ) : (
        "loading"
      )}
    </div>
  );
};

export default Upload;
