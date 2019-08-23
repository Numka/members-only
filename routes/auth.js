const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth");

router.get("/signup", authController.getSignup);

router.get("/login", authController.getLogin);

router.post(
  "/signup",
  [
    body("email", "please enter a valid email")
      .isEmail()
      .normalizeEmail(),
    body("nickname", "please enter a valid nickname")
      .isLength({ min: 3, max: 15 })
      .isAlphanumeric(),
    body("password", "please enter a valid password")
      .isLength({ min: 5, max: 200 })
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new err("Passwords have to match!");
        }
        return true;
      })
  ],
  authController.postSignup
);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

module.exports = router;
