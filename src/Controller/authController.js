const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../schema/userSchema");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const signup = async (req, res) => {
  try {
    let userData = req.body;
    userData.email = userData.email.toLowerCase();
    let isEmailAlreadyExists = await userModel.findOne({
      email: userData.email,
    });
    if (isEmailAlreadyExists) {
      res
        .status(403)
        .json({ isSuccess: false, data: {}, message: "ueser already exists" });
    } else {
      userData.password = await bcrypt.hash(userData.password, 10);
      let resp = await userModel.create(userData);
      let token = createToken({ _id: resp._id });
      let response = resp._doc;
      delete response.password;
      res
        .status(200)
        .json({
          isSuccess: true,
          data: { ...response, token },
          message: "success",
        });
    }
  } catch (error) {
    res
      .status(404)
      .json({ isSuccess: false, data: {}, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    let resp = await userModel.findOne({ email: req.body.email });
    if (!resp) {
      res
        .status(403)
        .json({ isSuccess: false, data: {}, message: "user not found" });
    } else {
      const areEqual = await bcrypt.compare(req.body.password, resp.password);
      if (!areEqual) {
        res
          .status(403)
          .json({ isSuccess: false, data: {}, message: "invalid-credentials" });
      } else {
        let token = createToken({ _id: resp._id });
        let response = resp._doc;
        delete response.password;
        res
          .status(200)
          .json({
            isSuccess: true,
            data: { ...response, token },
            message: "success",
          });
      }
    }
  } catch (error) {
    res
      .status(404)
      .json({ isSuccess: false, data: {}, message: error.message });
  }
};

function createToken({ _id }) {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIREDIN,
  });
}

module.exports = { signup, login };
