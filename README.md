This example illustrates how to use [Express](https://expressjs.com) 4.x and
[Passport](https://www.passportjs.org) to sign users in with a username and password. Use this example as a starting
point for your own web applications.

## Quick Start

To get started with this example, clone the repository and install the dependencies.

```shell
$ git clone https://github.com/passport/express-4.x-ldap-example.git
$ cd express-4.x-local-example
$ npm install
```

Unzip [slapd.zip](./slapd.zip) to `slapd`. This folder will be mounted to `openldap` service.

Compose pseudo LDAP services:

```shell
$ docker-compose up -d
```

- `openldap`: [ldap://localhost:389](ldap://localhost:389)
- `phpldapadmin`: [https://localhost:6443](https://localhost:6443)

  Admin account: `cn=admin,dc=example,dc=org` / `admin`

Start the server.

```shell
$ npm start
```

or watch mode:

```shell
$ npm start:watch
```

Navigate to [`http://localhost:3000`](http://localhost:3000).

User accounts to login:

| username | password |
| --- | --- |
| anlg | 123456 |
| anhntv | 123456 |
| manhpt | 123456 |

## Overview

This example illustrates how to use [Passport](https://www.passportjs.org) and
the [`passport-local`](https://www.passportjs.org/packages/passport-local/)
strategy within an [Express](https://expressjs.com) application to sign users in with a username and password.

The example builds upon the scaffolding created by [Express generator](https://expressjs.com/en/starter/generator.html),
and uses [EJS](https://ejs.co) as a view engine and plain CSS for styling.

The example uses [SQLite](https://www.sqlite.org) for storing user accounts. SQLite is a lightweight database that works
well for development, including this example.

Added to the scaffolding are files which add authentication to the application.

* [`boot/db.js`](boot/db.js)

  This file initializes the database by creating the tables used to store user accounts and credentials.

* [`boot/auth.js`](boot/auth.js)

  This file initializes Passport. It configures the password strategy with a
  `verify` callback. The callback verifies the password by finding the user account in the database. If the account is
  found, the callback hashes the password entered and compares it to the hashed password stored in the database. If the
  comparison is equal, the user is authenticated.

  This file also supplies the serialization functions used for session management.

* [`routes/auth.js`](routes/auth.js)

  This file defines the routes used for authentication. In particular, there are two routes used to authenticate with a
  username and password:

    - `GET /login`

      This route renders a page that prompts the user to enter their username and password.

    - `POST /login/password`

      This route authenticates the user using their username and password.

    - `GET /login/ldap`

      This route renders a page that prompts the user to enter their username and password provided by LDAP.

    - `POST /login/ldap`

      This route authenticates the user using their username and password via LDAP.

* [`routes/users.js`](routes/users.js)

  This file defines the routes used for registration. In particular, there are two routes used to create an account:

    - `GET /users/new`

      This route renders a page that prompts the user to enter the information needed to register an acccount. This
      information consists of their name, preferred username, and password.

    - `POST /users`

      This route creates a new account using the information entered by the user. The password is first hashed and
      stored in hashed format.

## License

[The Unlicense](https://opensource.org/licenses/unlicense)
