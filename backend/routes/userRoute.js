let express = require("express");
const { registerUser, loginUser, logout, forgotPassowrd, resetPassowrd } = require("../controllers/userController");
let router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassowrd)
router.route("/password/reset/:token").put(resetPassowrd);
router.route("/logout").get(logout);


module.exports = router;