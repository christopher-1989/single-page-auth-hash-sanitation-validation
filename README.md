# Single page authentication project

This project was based heavily on [this tutorial](https://www.loginradius.com/blog/async/hashing-user-passwords-using-bcryptjs/)

## Project overview

This short project was designed to develop skills for authenticating a user from a database. The User's input is sanitized before being validated for both /signup and /login routes.

_Express.js_ is used as the router for all requests on the two routes. Middleware for sanitization and validation have been created based on the _validator.js_ dependency.

MongoDB is used for persisting the User data and _mongoose.js_ is used to connect the express server to the database.
A basic "user" schema was created for storing email and password data inside the mongodb database User collection.

Lastly, User passwords are hashed **with salt** using _bycrypt.js_ before any response is sent.
