const { hash, compare } = require("bcryptjs");
require("dotenv").config();
const userSchema = require("./schema");
const {
  ForgotPasswordMail,
  SuccessForgotPasswordMail,
} = require("../model/email");
const tokenSchema = require("../Token/schema");
const generateToken = require("../utils/generateToken");

const allusers = async (req, res) => {
  try {
    const users = await userSchema.find();
    return res.status(200).json({ message: "All Users", users });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const signup = async (req, res) => {
  const { name, email, password, contactNo } = req.body;
  if (name && email && password && contactNo) {
    try {
      const user = await userSchema.exists({ email });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = await userSchema.create({
        name,
        email,
        contactNo,
        password: await hash(password, 10),
      });

      if (newUser) {
        await newUser.save();
        return res.status(201).json({
          message: "User Created Successfully",
          newUser,
        });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(422).json({ message: "Required Field Missing" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    try {
      const checkUser = await userSchema.findOne({ email });
      if (checkUser) {
        const decryptPass = await compare(password, checkUser.password);
        if (!decryptPass) {
          return res.status(400).json({ message: "Incorrect Password" });
        } else {
          const token = generateToken(checkUser);
          return res
            .cookie("jwt", token, {
              httpOnly: true,
              maxAge: 15 * 24 * 60 * 60 * 1000,
              sameSite: "strict",
              secure: process.env.NODE_ENV === "production" ? true : false,
            })
            .status(200)
            .json({
              message: "Successfully Login",
              _id: checkUser._id,
              name: checkUser.name,
              email: checkUser.email,
              gender: checkUser.gender,
              profilePic: checkUser.profilePic,
              address: checkUser.address,
              token: token,
            });
        }
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(403).json({ message: "Required Field Missing" });
  }
};

const logOut = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

const userProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await userSchema
      .findById(userId)
      .select("-password -contactNo");

    if (user) {
      return res.status(200).json({
        message: "User details",
        name: user.name,
        email: user.email,
        gender: user.gender,
        profilePic: user.profilePic,
        address: user.address,
      });
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const editUser = async (req, res) => {
  try {
    const { name, gender, contactNo, profilePic, address } = req.body;
    const userId = req.user.id;

    if (userId) {
      const filter = userId;
      const update = { name, gender, contactNo, profilePic, address };
      const updateUser = await userSchema.findByIdAndUpdate(filter, update, {
        new: true,
      });
      res
        .status(201)
        .json({ message: "user updated successfully", updateUser });
    } else {
      return res.status(404).send("user not found");
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const forgotPass = async (req, res) => {
  const { email } = req.body;
  if (!email || email === "") {
    return res.status(400).send("Invalid request");
  }

  try {
    const user = await userSchema.findOne({ email }).select("-password");
    if (!user) {
      return res
        .status(404)
        .send("user not found or please give a valid gmail address");
    }
    const token = Math.floor(100000 + Math.random() * 999999);

    await ForgotPasswordMail(user.name, email, token, "Reset your Password");
    await tokenSchema({ user, token }).save();

    return res.status(200).json("Request Send Successfully");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePass = async (req, res) => {
  const { token, password } = req.body;
  try {
    const userToken = await tokenSchema
      .findOne({ token })
      .populate("user")
      .select("-password");
    if (token) {
      const user = await userSchema.findById(userToken.user._id);
      const hashedPass = await hash(password, 10);
      await userSchema.updateOne({ _id: user._id }, { password: hashedPass });

      await SuccessForgotPasswordMail(user.email);
      return res.status(201).json("Password Updated Succesfully");
    } else {
      return res.status(400).json("Invalid or expired token");
    }
  } catch (error) {
    return res.status(404).json("User not found");
  }
};

const deleteuser = async (req, res) => {
  const userId = req.user.id;
  if (userId) {
    try {
      const deleteUser = await userSchema.findByIdAndDelete(userId).select("-password");
      res
        .status(200)
        .json({ message: "User Deleted Successfully", deleteUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(404).json({ message: "user not found" });
  }
};

const searchUser = async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    const user = await userSchema.find({ name });
    return res.status(200).json({ message: "User Found", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const searchByEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await userSchema.findOne({ email });
    if (user) {
      return res.status(200).json({ message: "User Found", user });
    } else {
      return res.status(404).json({ message: "User not Found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  allusers,
  signup,
  login,
  logOut,
  userProfile,
  editUser,
  forgotPass,
  updatePass,
  deleteuser,
  searchUser,
  searchByEmail,
};
