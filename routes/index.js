var express = require("express");
var router = express.Router();
var fs = require("fs");
var ejs = require("ejs");

var index = fs.readFileSync("./views/index.ejs", "UTF-8");
var navbar = fs.readFileSync("./views/navbar.ejs", "UTF-8");

router.get("/", function(req, res) {
    var data = ejs.render(index, { navbar: navbar });
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    res.end();
});

module.exports = router;