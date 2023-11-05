var express = require("express");
var router = express.Router();
const { User, Book, Cart } = require("../models");
const Validator = require("fastest-validator");

const v = new Validator();

router.get("/:idUser", async (req, res) => {
  const { idUser } = req.params;

  const cartItems = await Cart.findAll({
    where: { idUser: idUser },
  });

  if (!cartItems || cartItems.length === 0) {
    return res.status(200).json({ message: "Keranjang masih kosong" });
  }

  const bookIds = cartItems.map((item) => item.idBook);

  const borrowedBooks = await Book.findAll({
    where: { id: bookIds },
  });

  res.status(200).json({ borrowedBooks });
});

router.get("/:idUser/:idBook", async (req, res) => {
  const { idUser, idBook } = req.params;

  const cartItems = await Cart.findAll({
    where: { idUser: idUser, idBook: idBook },
  });

  if (!cartItems || cartItems.length === 0) {
    return res.status(200).json({ message: "Keranjang masih kosong" });
  }

  const bookIds = cartItems.map((item) => item.idBook);

  const borrowedBooks = await Book.findAll({
    where: { id: bookIds },
  });

  res.status(200).json({ borrowedBooks });
});

router.post("/", async (req, res) => {
  const schema = {
    idUser: "number",
    idBook: "number",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  const findIdUser = await User.findByPk(req.body.idUser, schema);

  const findIdBook = await Book.findByPk(req.body.idBook, schema);

  if (!findIdUser && !findIdBook) {
    return res.status(404).json({
      message: "Id User or Id Book not found",
      status: "Failed",
    });
  }

  const findSame = await Cart.findOne({
    where: {
      idUser: req.body.idUser,
      idBook: req.body.idBook,
    },
  });

  if (findSame) {
    return res.status(500).json({
      message: "Failed to add book to cart",
      status: "Failed",
    });
  }

  const cart = await Cart.create(req.body);
  res.status(201).json(cart);
});

router.delete("/:idUser/:idBook", async (req, res) => {
  const { idUser, idBook } = req.params;

  const cartItem = await Cart.findOne({
    where: { idUser: idUser, idBook: idBook },
  });

  if (!cartItem) {
    return res.status(404).json({ message: "Book not found in the cart" });
  }

  await cartItem.destroy();

  res.status(200).json({ message: "Book removed from the cart successfully" });
});

module.exports = router;
