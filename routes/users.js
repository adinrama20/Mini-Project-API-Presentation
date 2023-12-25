require("dotenv").config();
const { SECRET_KEY } = process.env;
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const verification = require("../middleware/verification");
const Validator = require("fastest-validator");

const v = new Validator();

router.get("/:id", verification, async (req, res) => {
  const { id } = req.params;

  const findUser = await User.findByPk(id);

  if (!findUser) {
    return res.status(404).json({ message: "Pengguna tidak ditemukan" });
  }

  res.status(200).json({ findUser });
});

router.post("/register", async (req, res) => {
  const schema = {
    name: "string|empty:false",
    mobile: "string",
    email: "string|email",
    password: "string",
    address: "string",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  const findEmail = await User.findOne({
    where: { email: req.body.email },
  });

  const findMobile = await User.findOne({
    where: { mobile: req.body.mobile },
  });

  if (findEmail || findMobile) {
    return res.status(400).json({
      message: "Email or mobile already exists",
      status: "Failed",
    });
  }

  const user = await User.create(req.body);
  res.status(201).json({
    message: "User added successfully",
    status: "Success",
    data: user,
  });
});

router.post("/login", async (req, res) => {
  const input = {
    email: "string",
    password: "string",
  };

  const validate = v.validate(req.body, input);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  const findUser = await User.findOne({
    where: { email: req.body.email, password: req.body.password },
  });

  if (findUser) {
    findUser.token = jwt.sign(
      { id: findUser.id, email: findUser.email },
      SECRET_KEY,
      { expiresIn: "90s" }
    );

    return res.status(200).json({
      message: "Successfully login",
      status: "Success",
      id: findUser.id,
      token: findUser.token,
    });
  }

  res.status(404).json({
    message: "User not found",
    status: "Failed",
  });
});

router.put("/:id", verification, async (req, res) => {
  const { id } = req.params;

  const schema = {
    name: "string|empty:false",
    mobile: "string",
    email: "string|email",
    password: "string",
    address: "string",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "Pengguna tidak ditemukan",
        status: "Failed",
      });
    }

    await user.update(req.body);

    return res.status(200).json({
      message: "Data pengguna berhasil diperbarui",
      status: "Success",
      data: user,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan saat mengedit data pengguna",
      status: "Error",
    });
  }
});

module.exports = router;
