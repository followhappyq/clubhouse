import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: "server/.env" });

import { passport } from "./core/passport";

const app = express();

app.use(passport.initialize());

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    res.send(
      `<script>window.opener.postMessage('${JSON.stringify(
        req.user
      )}', '*');window.close();</script>`
    );
  }
);

app.listen(3001, () => {
  console.log("server runned");
});
