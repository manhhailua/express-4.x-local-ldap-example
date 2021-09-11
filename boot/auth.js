const passport = require("passport");
const LocalStrategy = require("passport-local");
const LdapStrategy = require("passport-ldapauth");
const crypto = require("crypto");
const db = require("../db");

module.exports = function () {
  // Configure the local strategy for use by Passport.
  //
  // The local strategy requires a `verify` function which receives the credentials
  // (`username` and `password`) submitted by the user.  The function must verify
  // that the password is correct and then invoke `cb` with a user object, which
  // will be set at `req.user` in route handlers after authentication.
  passport.use(
    new LocalStrategy(function (username, password, cb) {
      db.get(
        "SELECT rowid AS id, * FROM users WHERE username = ?",
        [username],
        function (err, row) {
          if (err) {
            return cb(err);
          }
          if (!row) {
            return cb(null, false, {
              message: "Incorrect username or password.",
            });
          }

          crypto.pbkdf2(
            password,
            row.salt,
            10000,
            32,
            "sha256",
            function (err, hashedPassword) {
              if (err) {
                return cb(err);
              }
              if (
                !crypto.timingSafeEqual(row.hashed_password, hashedPassword)
              ) {
                return cb(null, false, {
                  message: "Incorrect username or password.",
                });
              }

              const user = {
                id: row.id.toString(),
                username: row.username,
                displayName: row.name,
                strategy: "local",
              };
              return cb(null, user);
            }
          );
        }
      );
    })
  );

  // Configure the ldap strategy for use by Passport.
  //
  // Refs:
  // - https://github.com/vesse/passport-ldapauth#express-example
  // - https://github.com/vesse/node-ldapauth-fork#ldapauth-config-options
  passport.use(
    new LdapStrategy(
      {
        server: {
          url: "ldap://localhost:389",
          bindDN: "cn=admin,dc=example,dc=org",
          bindCredentials: "admin",
          searchBase: "dc=example,dc=org",
          searchFilter: "(uid={{username}})",
        },
      },
      function (user, done) {
        if (user) {
          return done(null, {
            id: user.uid,
            username: user.uid,
            displayName: `${user.givenName} ${user.sn}`,
            strategy: "ldap",
          });
        }
      }
    )
  );

  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  The
  // typical implementation of this is as simple as supplying the user ID when
  // serializing, and querying the user record by ID from the database when
  // deserializing.
  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        strategy: user.strategy,
      });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });
};
