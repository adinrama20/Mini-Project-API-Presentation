require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const apiDoc = require("./apidocs.json");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");
const cartsRouter = require("./routes/carts");
const borrowRouter = require("./routes/borrows");

const app = express();
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/miniproject-api-docs", swaggerUi.serve, swaggerUi.setup(apiDoc));

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/books", booksRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/borrow", borrowRouter);

module.exports = app;
