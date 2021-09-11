var express = require("express");
var ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;
var db = require("../db");

var router = express.Router();

/* GET users listing. */
router.get("/", ensureLoggedIn("/login/ldap"), function (req, res, next) {
  if (req.user.strategy === "ldap") {
    return res.render("profile", { user: req.user });
  }

  db.get(
    "SELECT rowid AS id, username, name FROM users WHERE rowid = ?",
    [req.user.id],
    function (err, row) {
      if (err) {
        return next(err);
      }

      // TODO: Handle undefined row.

      res.render("profile", {
        user: {
          id: row.id.toString(),
          username: row.username,
          displayName: row.name,
        },
      });
    }
  );
});

module.exports = router;
