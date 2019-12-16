const express = require("express");
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const helper = require("./helper");

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(cookieSession({
  name: 'session',
  keys: ['userId']
}));

const getListOfURLs = () => {
  obj = {}
  Object.keys(urlDatabase).map(item => {
    obj[item] = urlDatabase[item]['longURL']
  })
  return obj;
}

const getLongFromShort = (short) => {
  return urlDatabase[short].longURL
}

function urlsForUsers(userId) {
  obj = {}
  Object.keys(urlDatabase).map(item => {
    if (urlDatabase[item].userId === userId) {
      obj[item] = urlDatabase[item]['longURL']
    }
  })
  return obj;
};

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userId: "users[userId].id}"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userId: "users[userId].id}"
  }
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
  const user = req.session.userId;
  if (user) {
    let templateVars = { id: req.session.userId, user: users[req.session.userId] }
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }
});

app.get("/hello", (req, res) => {
  res.render("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const user = req.session.userId
  if (user) {
    let templateVars = { urls: urlsForUsers(req.session.userId), user: users[req.session.userId] }
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
}
);

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: getLongFromShort(req.params.shortURL), user: users[req.session.userId], };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortPass = generateRandomString();
  urlDatabase[shortPass] = { longURL: req.body.longURL, userId: req.session.userId };
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
  res.redirect(getLongFromShort(req.params.shortURL));
});

//Deletes posts ()
app.post("/urls/:shortURL/delete", (req, res) => {
  const user = req.session.userId;
  if (user) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.redirect("/login")
  }
});

//Updates posts ()
app.post("/urls/:id/", (req, res) => {
  const user = req.session.userId;
  if (user) {
    const shortPass = req.params.id;
    urlDatabase[shortPass] = { longURL: req.body.longURL, userId: req.session.userId }
    res.redirect('/urls/');
  } else {
    res.redirect("/login")
  }
});

//Set Login route w/ cookie
app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let user = helper.emailVerify(email, users);
  let hashedPassword = bcrypt.hashSync(password, 10);
  if (user && bcrypt.compareSync(password, hashedPassword)) {
    req.session.userId = userId;
    res.redirect("/urls");
  } else {
    res.render("login", { error: 'Email and password combination is invalid' });
  };
})

//set logout
app.post("/logout", (req, res) => {
  req.session.userId = undefined;
  res.redirect('/urls/');
})

//set register-redirect
app.get("/register", (req, res) => {
  let templateVars = { urls: getListOfURLs(), user: req.session.userId }
  res.render("register", templateVars);
});

//set login page
app.get("/login", (req, res) => {
  let templateVars = { urls: getListOfURLs(), user: undefined }
  res.render("login", templateVars);
});

//register new-user
app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.render("register", { error: 'Email or Password was not provided' });
  };
  if (helper.emailVerify(req.body.email)) {
    return res.render("register", { error: 'Email already exists, please login' });
  };
  const userId = generateRandomString();
  let newUser = { userId: userId, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10) };
  users[userId] = newUser;
  req.session.userId = userId;
  res.redirect("/urls");
});

