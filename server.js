import express from "express";
import steam from "steam-login";

import express_session from "express-session";
import dotenv from "dotenv";
dotenv.config();

var app = express();

app.use(
  express_session({
    resave: false,
    saveUninitialized: false,
    secret: "a secret",
  })
);
app.use(
  steam.middleware({
    realm: `${process.env.BASE_URL}:${process.env.PORT}`,
    verify: `${process.env.BASE_URL}:${process.env.PORT}/verify`,
    apiKey: `${process.env.STEAM_API_KEY}`,
  })
);

app.get("/", function (req, res) {
  res
    .send(req.user == null ? "not logged in" : "hello " + req.user.username)
    .end();
});

app.get("/authenticate", steam.authenticate(), function (req, res) {
  res.redirect("/");
});

app.get("/verify", steam.verify(), function (req, res) {
  res.send(req.user).end();
});

app.get("/logout", steam.enforceLogin("/"), function (req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("✅ Сервер запущен: http://localhost:3000");
});
