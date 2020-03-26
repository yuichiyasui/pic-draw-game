var express = require("express");
var router = express.Router();
var fs = require("fs");

var navbar = fs.readFileSync("./views/navbar.ejs", "utf-8");

router.get("/", function(req, res) {
  res.render("index.ejs", { navbar: navbar });
});

module.exports = router;
