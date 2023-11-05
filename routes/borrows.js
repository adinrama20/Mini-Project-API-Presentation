var express = require("express");
var router = express.Router();
const { Cart, Borrow } = require("../models");
const Validator = require("fastest-validator");

const v = new Validator();

router.get("/:idUser", async (req, res) => {
  const { idUser = "number" } = req.params;

  const validate = v.validate(req.params);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  try {
    const findIdUserOnCarts = await Cart.findAll({
      where: { idUser: idUser },
    });

    const findIdCartOnBorrows = await Borrow.findAll({
      where: { idCart: findIdUserOnCarts.idCart },
    });

    if (!findIdCartOnBorrows) {
      return res
        .status(404)
        .json({ message: "Terjadi kesalahan saat mendapatkan id user" });
    }

    const bookIds = findIdCartOnBorrows.map((item) => item.idBook);

    const borrowedBooks = await Book.findAll({
      where: { id: bookIds, idCart: findIdUserOnCarts.id },
    });

    res.status(200).json({ borrowedBooks });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil id user",
      status: "Error",
    });
  }
});

router.post("/", async (req, res) => {
  const schema = {
    idCart: "number",
    tglPinjam: "string",
    tglKembali: "string",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  try {
    const findIdCart = await Cart.findByPk(req.body.idCart);

    if (!findIdCart) {
      return res.status(404).json({
        message: "Informasi cart buku gagal disimpan. Cart not found",
        status: "Failed",
      });
    }

    const existingBorrow = await Borrow.findOne({
      where: { idCart: req.body.idCart },
    });

    if (existingBorrow) {
      return res.status(400).json({
        message: "Informasi cart buku gagal disimpan. Cart already exists",
        status: "Failed",
      });
    }

    const borrow = await Borrow.create(req.body);
    res.status(201).json({
      message: "Informasi cart buku berhasil disimpan",
      status: "Success",
      data: borrow,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat menyimpan informasi cart buku",
      status: "Error",
    });
  }
});

module.exports = router;
