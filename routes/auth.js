var express = require("express");
var passport = require("passport");

var router = express.Router();

/* GET users listing. */
router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: "/myaccount",
    failureRedirect: "/login",
    failureMessage: true,
  })
);

router.get("/login/ldap", function (req, res, next) {
  res.render("login-ldap");
});

router.post(
  "/login/ldap",
  passport.authenticate("ldapauth", {
    successRedirect: "/myaccount",
    failureRedirect: "/login/ldap",
    failureMessage: true,
  })
);

router.get("/logout", function (req, res, next) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
