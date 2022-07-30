const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, deleteReview, getProductReviews } = require("../controllers/productController");
const { createProductReview } = require("../controllers/userController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles("admin","shg-admin"), createProduct);
router.route("/admin/product/:id")
.put(isAuthenticatedUser,authorizeRoles("admin","shg-admin"), updateProduct)
.delete(isAuthenticatedUser,authorizeRoles("admin","shg-admin"), deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser,createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser,deleteReview);


module.exports = router;