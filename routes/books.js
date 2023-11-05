var express = require("express");
var router = express.Router();
const { Book } = require("../models");
const { Op } = require("sequelize");
const Validator = require("fastest-validator");

const v = new Validator();

router.get("/", async (req, res) => {
  const books = await Book.findAll();
  res.status(200).json(books);
});

router.get("/search", async (req, res) => {
  const { keyword } = req.query;

  const books = await Book.findAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          author: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ],
    },
  });

  if (books.length == 0) {
    return res.status(404).json({
      message: "Daftar buku berdasaran keyword tidak tersedia",
      status: "Failed",
    });
  }

  res.status(200).json({ books });
});

router.post("/", async (req, res) => {
  const schema = {
    photo: "string",
    title: "string",
    author: "string",
    publisher: "string",
    publicationYear: "string",
    description: "string",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  const findTitle = await Book.findOne({
    where: { title: req.body.title },
  });

  if (findTitle) {
    return res.status(400).json({
      message: "Title already exists",
      status: "Failed",
    });
  }

  const book = await Book.create(req.body);
  res.status(201).json({
    message: "Book added successfully",
    status: "Success",
    data: book,
  });
});

module.exports = router;
