import express from "express";
import steam from "steam-login";

import express_session from "express-session";
import dotenv from "dotenv";
dotenv.config();

var app = express();

function queryToString(query) {
  const params = new URLSearchParams(query);
  return params.toString() ? `?${params.toString()}` : "";
}

app.use(
  express_session({
    resave: false,
    saveUninitialized: false,
    secret: "a secret",
  })
);
app.use(
  steam.middleware({
    realm: `${process.env.BASE_URL}`,
    verify: `${process.env.BASE_URL}/verify`,
    apiKey: `${process.env.STEAM_API_KEY}`,
  })
);

app.get("/", function (req, res) {
  res.redirect(process.env.CLIENT_BASE_URL);
});

app.get("/authenticate", steam.authenticate(), function (req, res) {
  res.redirect("/");
});

app.get("/verify", steam.verify(), function (req, res) {
  res.redirect(
    process.env.CLIENT_BASE_URL + "/steam/callback" + queryToString(req.query)
  );
});

app.get("/logout", steam.enforceLogin("/"), function (req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(process.env.PORT, () => {
  console.log("✅ Сервер запущен: http://localhost:3000");
});
