import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { LogIn } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signin } from "../../features/API/Index";
import { toast } from "react-toastify";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authData } = useSelector((store) => store.auth);

  const googleSuccess = async (res) => {
    const data = await signin(res);
    const {
      payload: { result },
    } = dispatch(LogIn(data));
    console.log("authData", result);
    if (result) {
      navigate(`/upload`);
      toast.success(`Welcome ${result.name}! `, {
        theme: "colored",
        autoClose: 3000,
      });
    }
  };
  return (
    <div>
      <h1 className="text-4xl flex justify-center mt-40 font-bold text-cyan-400">
        Login to Continue
      </h1>
      <div className="flex h-5/6 justify-center mt-40 ">
        <GoogleLogin
          onSuccess={googleSuccess}
          onError={() => {
            console.log("Login Failed");
            toast.error(`Try Again! `, { theme: "colored", autoClose: 3000 });
            navigate("/");
          }}
        />
      </div>
    </div>
  );
};

export default Home;
