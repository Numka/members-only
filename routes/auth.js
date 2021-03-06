const express = require("express");
const { body } = require("express-validator");

//my middleware
const isAuth = require("../middleware/isAuth");
const isNotAuth = require("../middleware/isNotAuth");
//

const router = express.Router();

const authController = require("../controllers/auth");

router.get("/signup", isNotAuth, authController.getSignup);

router.get("/login", isNotAuth, authController.getLogin);

router.post(
  "/signup",
  [
    body("email", "Please enter a valid email")
      .isEmail()
      .normalizeEmail(),
    body(
      "nickname",
      "Nickname should be 3-15 characters long. Only numbers and letters are allowed"
    )
      .isLength({ min: 3, max: 15 })
      .isAlphanumeric(),
    body("password", "Password should be 5-200 characters long")
      .trim()
      .isLength({ min: 5, max: 200 }),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      })
  ],
  isNotAuth,
  authController.postSignup
);

router.post(
  "/login",
  [
    body("email", "Please enter a valid email")
      .isEmail()
      .normalizeEmail(),
    body("password", "Please enter a valid password")
      .isLength({
        min: 5,
        max: 200
      })
      .trim()
  ],
  isNotAuth,
  authController.postLogin
);

router.post("/logout", isAuth, authController.postLogout);

// reset password flow
router.get("/reset", authController.getReset);

router.post("/reset/", authController.postReset);

router.get("/new-password/:token", authController.getNewPassword);

router.post(
  "/new-password",
  [
    body("password", "Password should be 5-200 characters long")
      .trim()
      .isLength({ min: 5, max: 200 }),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!')
        }
        return true;
      })
  ],
  authController.postNewPassword
);

module.exports = router;
