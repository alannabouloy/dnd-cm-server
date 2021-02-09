const express = require("express");
const AuthService = require("./auth-service");

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter.post("/login", jsonBodyParser, async (req, res, next) => {
  const { username, user_password } = req.body;
  const loginUser = { username, user_password };
  const db = req.app.get("db");

  for (const [key, value] of Object.entries(loginUser)) {
    if (value == null) {
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });
    }
  }

  try {
    //set user from database
    const dbUser = await AuthService.getUserWithUserName(
      db,
      loginUser.username
    );

    if (!dbUser) {
      return res
        .status(400)
        .json({ 
            error: "Incorrect username or user_password"
         });
    }

    //compare user_password to password given
    const compareMatch = await AuthService.comparePasswords(
      loginUser.user_password,
      dbUser.user_password
    );

    if (!compareMatch) {
      return res.status(400).json({
        error: "Incorrect username or user_password",
      });
    }

    //create JWT

    const sub = dbUser.username;
    const payload = { user_id: dbUser.id };
    const token = AuthService.createJwt(sub, payload);

    res.json({
      authToken: token,
    });

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = authRouter;
