import fs from "node:fs";
import express from "express";
import ejs from "ejs";

const router = express.Router();

const VIEWS_DIR = __dirname + "/../views/";

const index = fs.readFileSync(`${VIEWS_DIR}index.ejs`, {
  encoding: "utf-8",
});
const navbar = fs.readFileSync(`${VIEWS_DIR}navbar.ejs`, {
  encoding: "utf-8",
});

router.get("/", function (req, res) {
  const data = ejs.render(index, { navbar: navbar });
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(data);
  res.end();
});

export default router;
