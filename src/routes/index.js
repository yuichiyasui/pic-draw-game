const express = require("express");
const router = express.Router();
const fs = require("fs");
const ejs = require("ejs");

const VIEWS_DIR = __dirname + "/../views/";

const index = fs.readFileSync(`${VIEWS_DIR}index.ejs`, "UTF-8");
const navbar = fs.readFileSync(`${VIEWS_DIR}navbar.ejs`, "UTF-8");

router.get("/", function (req, res) {
  const data = ejs.render(index, { navbar: navbar });
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(data);
  res.end();
});

module.exports = router;
