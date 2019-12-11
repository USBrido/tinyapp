const express = require("express");
const app = express();
const PORT = 8080; //default port, 8080 (might have some issues when running, just in case I forget that)
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(cookieParser());
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"] }
  res.render("urls_new", templateVars);
});

app.get("/hello", (req, res) => {
  res.render("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] }
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"], };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortPass = generateRandomString();
  urlDatabase[shortPass] = req.body.longURL
  res.redirect(`/urls/`);        
});

function generateRandomString() {
  var length = 6,
    allchar = "0123456789abcdefghijklmnopqrstuvwxyz",
    shortgen = '';
  for (var i = 0; i < length; i++) {
    shortgen += allchar.charAt(Math.floor(Math.random() * allchar.length));
  }
  return shortgen;
};

app.get("/u/:shortURL", (req, res) => {
res.redirect(longURL);
});

//Deletes posts ()
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

//Updates posts ()
app.post("/urls/:id/", (req, res) => {
  const shortPass = req.params.id;
  urlDatabase[shortPass] = req.body.longURL
  res.redirect('/urls/');
});

//Set Login route w/ cookie
app.post("/login", (req, res) => {
  console.log(req.body)
  res.cookie("username", req.body.username);
  res.redirect("/urls");
})

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls/');
})

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});