import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { LogIn } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signin } from "../../features/API/Index";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authData = useSelector((store) => store.auth);
  const googleSuccess = async (res) => {
    // const result = jwt_decode(res?.credential);
    const data = await signin(res);
    console.log(data);
    // const { name, picture, sub } = result;
    dispatch(LogIn(data));
    console.log("authData", authData);
    if (authData) {
      navigate(`/upload`);
    }

    // console.log(result);
  };
  return (
    <div>
      <GoogleLogin
        onSuccess={googleSuccess}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
};

export default Home;
