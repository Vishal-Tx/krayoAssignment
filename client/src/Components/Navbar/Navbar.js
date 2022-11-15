import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  const handleLogout = () => {
    setUser(null);
    dispatch(LogOut());

    navigate("/");
    toast("GoodBye!");
  };
  // console.log("user", user);
  return (
    <div
      className="w-full
      bg-cyan-400 flex justify-center h-20 items-center max-[680px]:justify-start"
    >
      <p className=" text-4xl font-bold text-white ml-3">STORE</p>
      {user ? (
        <div className="right-0 absolute items-center flex justify-end">
          <p className="max-[680px]:hidden">{user.result?.name}</p>
          <img
            className="rounded-full mx-3 w-10"
            src={user.result?.picture}
            alt="dp"
          />
          <button
            className="mx-3 rounded bg-red-600 p-3 hover:bg-red-800 active:bg-red-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;
