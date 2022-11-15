import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use((req) => {
  if (!!localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile"))?.token
    }`;
  }
  req.headers.myCustom = "help";
  return req;
});

export const signin = async (accessToken) => {
  try {
    const { data } = await API.post("/signin", accessToken);
    console.log("apidata", data);
    return data;
  } catch (error) {
    console.log("apierror", error);
  }
};

export const uploadAuth = async (user) => {
  try {
    const { data } = await API.post("/upload", user);
    return data;
  } catch (error) {
    console.log("uploadauthError", error);
  }
};

export const uploadFiles = async (files) => {
  try {
    const { data } = await API.patch("/upload", files);
    console.log("uploadFilesData", data);
    return data;
  } catch (error) {
    console.log("uploadFilesError", uploadFiles);
  }
};

export const downloadFile = async (fileId) => {
  try {
    const { data } = await API.post("/upload/download", fileId);
    console.log("downloadFileData", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
