import jwt from "jsonwebtoken";

import User from "../models/user.js";
import jwt_decode from "jwt-decode";
import { authenticateGoogle, createDriveFolder } from "../gCloud/index.js";

const secret = "test";

export const signin = async (req, res) => {
  // console.log("req.headers", req.headers);
  //   const { googleAccessToken } = req.body;
  //   console.log(req.body);
  const { credential } = req.body;
  const { name, picture, sub, email } = jwt_decode(credential);
  //   console.log(result);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
      },
      secret,
      { expiresIn: "1h" }
    );

    const loggedInUser = {
      name: existingUser.name,
      picture: existingUser.picture,
      email: existingUser.email,
    };
    return res.status(200).json({ result: loggedInUser, token });
  }

  const result = await User.create({
    email,
    name,
    picture,
  });

  const auth = authenticateGoogle();
  const userFolderId = await createDriveFolder(result._id, auth);
  result.folderId = userFolderId;
  await result.save();
  console.log("result", result);

  const token = jwt.sign(
    {
      email: result.email,
      id: result._id,
    },
    secret,
    { expiresIn: "1h" }
  );

  const loggedInUser = {
    name: result.name,
    picture: result.picture,
    email: result.email,
  };

  return res.status(200).json({ result: loggedInUser, token });

  //   axios
  //     .get("https://www.googleapis.com/oauth2/v3/userinfo", {
  //       headers: {
  //         Authorization: `Bearer ${credential}`,
  //       },
  //     })
  //     .then(async (response) => {
  //       console.log("response", response);
  //       //   const firstName = response.data.given_name;
  //       //   const lastName = response.data.family_name;
  //       //   const email = response.data.email;
  //       //   const picture = response.data.picture;

  //       //   const existingUser = await User.findOne({ email });

  //       //   if (!existingUser)
  //       //     return res.status(404).json({ message: "User don't exist!" });

  //       //   const token = jwt.sign(
  //       //     {
  //       //       email: existingUser.email,
  //       //       id: existingUser._id,
  //       //     },
  //       //     config.get("JWT_SECRET"),
  //       //     { expiresIn: "1h" }
  //       //   );

  //       res.status(200).json({ result: existingUser, token });
  //     })
  //     .catch((err) => {
  //       res.status(400).json({ message: "Invalid access token!" });
  //     });
};
