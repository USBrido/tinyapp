const express = require("express");
const app = express();
const PORT = 8080; //default port, 8080 (might have some issues when running, just in case I forget that)

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/hello", (req, res) => {
  res.render("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});

app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase}
  res.render("urls_index", templateVars);
});

