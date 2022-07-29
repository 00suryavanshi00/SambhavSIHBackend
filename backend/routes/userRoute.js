let express = require("express");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");
const { registerUser, loginUser, logout, forgotPassowrd, resetPassowrd, getUserDetails, updatePassword, updateUserProfile } = require("../controllers/userController");
let router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassowrd)
router.route("/password/reset/:token").put(resetPassowrd);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser,getUserDetails);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/me/update").put(isAuthenticatedUser,updateUserProfile);


module.exports = router;