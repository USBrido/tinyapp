const express = require("express");
const app = express();
const PORT = 8080; //default port, 8080 (might have some issues when running, just in case I forget that)
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(cookieParser());


const getListOfURLs = () => {
  obj = {}
  Object.keys(urlDatabase).map(item => {
    obj[item] = urlDatabase[item]['longURL']
  })
  return obj;
}

const getLongFromShort = (short) => {
  return {
    shortURL: short,
    longURL: urlDatabase[short].longURL
  }
}

function urlsForUsers(userId) {
  obj = {}
  Object.keys(urlDatabase).map(item => {
    if (urlDatabase[item].userId === userId) {
    obj[item] = urlDatabase[item]['longURL']
    }
    console.log("userId",  userId) 
    console.log("urlDatabase[item].userId", urlDatabase[item].userId)
  })
  console.log("obj", obj)
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

// console.log(getListOfURLs());

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
  const user = req.cookies["userId"];
  if (user) {
    let templateVars = { id: req.cookies["userId"], user: users[req.cookies["userId"]] }
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }
});

app.get("/hello", (req, res) => {
  res.render("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const user = req.cookies["userId"];
  if (user) {
  let templateVars = { urls: urlsForUsers(req.cookies["userId"]), user: users[req.cookies["userId"]] }
  res.render("urls_index", templateVars);
  } else {
  res.redirect("/login");
  }
}
);

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: getLongFromShort(req.params.shortURL), user: users[req.cookies["userId"]], };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortPass = generateRandomString();
  urlDatabase[shortPass] = { longURL: req.body.longURL, userId: req.cookies["userId"] };
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
  urlDatabase[shortPass] = {
    longURL: req.body.longURL,
    userID: users[req.cookies["userId"]],
  }
  res.redirect('/urls/');
});

//Get req  ()
// app.get("/urls/:id", (req, res) => {
//   let templateVars = { urls: urlsForUsers(req.cookies["userId"]), user: users[req.cookies["userId"]],  } 
//   console.log("Consolelogged here")
//   res.render("urls_index", templateVars);
// }); 

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
  let templateVars = { urls: getListOfURLs(), user: users[req.cookies["userId"]] }
  res.render("register", templateVars);
});

//set login page
app.get("/login", (req, res) => {
  let templateVars = { urls: getListOfURLs(), user: users[req.cookies["userId"]] }
  res.render("login", templateVars);
});

//register new-user
app.post("/register", (req, res) => {
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



*/