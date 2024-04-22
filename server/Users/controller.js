const { hash, compare } = require("bcryptjs");
require("dotenv").config();
const userSchema = require("./schema");
const randomstring = require("randomstring");
const { sign } = require("jsonwebtoken");
const {
  ForgotPasswordMail,
  SuccessForgotPasswordMail,
} = require("../model/email");
const Token = require("../Token/schema");

const allusers = async (req, res) => {
  try {
    const users = await userSchema.find();
    res.status(200).json({ message: "All Users", users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (name && email && password) {
    try {
      const user = await userSchema.exists({ email });
      if (!user) {
        const newuser = await userSchema.create({
          name,
          email,
          password: await hash(password, 10),
        });
        res.status(201).json({ message: "User Created Successfully", newuser });
      } else {
        res.status(400).json({ message: "User Already Exist" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(422).json({ message: "Required Field Missing" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    try {
      const checkUser = await userSchema.findOne({ email });
      if (checkUser) {
        const decryptPass = await compare(password, checkUser.password);

        if (decryptPass && email == checkUser.email) {
          const token = sign(
            {
              name: checkUser.name,
              email: checkUser.email,
              role: checkUser.role,
            },
            process.env.JWT_SECRET
          );
          res.status(200).json({ message: "Successfully Login", token });
        } else {
          res.status(400).json({ message: "Incorrect Password" });
        }
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(403).json({ message: "Required Field Missing" });
  }
};

const editUser = async (req, res) => {
  const { _id, name, email } = req.body;

  if (_id) {
    try {
      const filter = { _id };
      const update = { name, email };
      const updateUser = await userSchema.findOneAndUpdate(filter, update, {
        new: true,
      });
      res
        .status(201)
        .json({ message: "user updated successfully", updateUser });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  } else {
    res.status(404).send("user not found");
  }
};

const forgotPass = async (req, res) => {
  const { email } = req.body;
  if (!email || email === "") {
    res.status(400).send("Invalid request");
  }

  try {
    const user = await userSchema.findOne({ email }).select("-password");
    if (!user) {
      res.status(404).send("user not found");
    }
    // const token = nanoid(32);
    const token = randomstring.generate();
    // send email to user with token
    await ForgotPasswordMail(user.name, email, token, "Reset your Password");
    await Token({ user, token }).save();

    res.status(200).json("Request Send Successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePass = async (req, res) => {
  const { tokenId, password } = req.body;
  try {
    const token = await Token.findOne({ token: tokenId })
      .populate("user")
      .select("-password");
    if (token) {
      const user = await userSchema.findById(token.user._id);

      const hashedPass = await hash(password, 10);
      await userSchema.updateOne({ _id: user._id }, { password: hashedPass });

      await SuccessForgotPasswordMail(user.email);
      res.status(201).json("Password Updated Succesfully");
    } else {
      res.status(400).json("Invalid or expired token");
    }
  } catch (error) {
    res.status(404).json("User not found");
  }
};

const deleteuser = async (req, res) => {
  const { name } = req.body;
  if (name) {
    try {
      const deleteUser = await userSchema.findOneAndDelete({ name });
      res
        .status(200)
        .json({ message: "User Deleted Successfully", deleteUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: "user not found" });
  }
};

module.exports = {
  allusers,
  signup,
  login,
  editUser,
  forgotPass,
  updatePass,
  deleteuser,
};
