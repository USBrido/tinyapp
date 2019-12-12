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

const users = {
  //   "userRandomID": {
  //     id: "userRandomID", 
  //     email: "user@example.com", 
  //     password: "purple-monkey-dinosaur"
  //   },
  //  "user2RandomID": {
  //     id: "user2RandomID", 
  //     email: "user2@example.com", 
  //     password: "dishwasher-funk"
  //   }
}


app.get("/urls/new", (req, res) => {
  let templateVars = { id: req.cookies["userId"] }
  res.render("urls_new", templateVars);
});

app.get("/hello", (req, res) => {
  res.render("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies["userId"]] }
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies["userId"]], };
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

// email verification
function emailVerify(email) {
  for (userId in users) {
    if (email === users[userId].email) {
      return users[userId];     
    }
  }
  return false
};

//Set Login route w/ cookie
app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let user = emailVerify(email);
  if (user && user.password === password) {
    res.cookie("userId", user.userId);
  } else {
    res.sendStatus(403); return
  };
  res.redirect("/urls");
})

//set logout
app.post("/logout", (req, res) => {
  res.clearCookie('userId');
  res.redirect('/urls/');
})

//set register-redirect
app.get("/register", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies["userId"]] }
  res.render("register", templateVars);
});

//set login page
app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies["userId"]] }
  res.render("login", templateVars);
});

//register new-user
app.post("/register", (req, res) => {
 // stopped working
  
  if (!emailVerify(req.body.email)) {
  const userId = generateRandomString();
  let newUser = { userId: userId, email: req.body.email, password: req.body.password };
  users[userId] = newUser;
  res.cookie("userId", userId);
  res.redirect("/urls");
  } else {
    res.sendStatus(400);
  }
});



app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});

/*
Things to be addressed

A user can register (done)
A user cannot register with an email address that has already been used (done)
A user can log in with a correct email/password  (done)
A user sees the correct information in the header (done)
A user cannot log in with an incorrect email/password (done)
A user can log out (done)




*/