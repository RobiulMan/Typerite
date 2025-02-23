require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3010;

// database conntection
const dbConnection = require("./db/dbConnection");

dbConnection();
// Import Middleware
const setMiddlewares = require("./middleware/middlewares");

// Import Routes
const setRoutes = require("./routes/routes");

// Setup View Engine
const viewPath = path.join(__dirname, "./views");

const viewPagesPath = path.join(__dirname, "./views/pages");
app.set("view engine", "ejs");
app.set("views", [viewPath, viewPagesPath]);

// Using middleware from middleware directory
setMiddlewares(app);

// Using router from ./routers directory
setRoutes(app);

// all static asset
app.use("*/css", express.static(path.join(__dirname, "./public/css")));
app.use("*/js", express.static(path.join(__dirname, "./public/js")));
app.use("*/images", express.static(path.join(__dirname, "./public/images")));
app.use("*/upload", express.static(path.join(__dirname, "./public/upload")));
app.use("*/public", express.static(path.join(__dirname, "./public")));

// all static page
app.get("/about", (req, res) => res.render("about"));
app.get("/contact", (req, res) => res.render("contact"));

app.use((req, res, next) => {
  const error = new Error("404 Page Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  if (error.status === 404) {
    res.render("error/404");
  } else {
    res.render("error/500");
  }
  next();
});

// server running
app.listen(PORT, () =>
  console.log(`Server is running on the url http://localhost:${PORT}`)
);
