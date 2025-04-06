const express = require("express");
const { registerUser } = require("../controllers/authController");
const { loginUser } = require("../controllers/authController");
const { logoutUser } = require("../controllers/authController");
const {forgotPassword} = require("../controllers/authController");
const {resetPassword} = require("../controllers/authController");
const {getUserDetails} = require("../controllers/authController");
const {getAllUsers} = require("../controllers/authController");
const {deleteUser} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists
 */

router.post("/register", registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "mallikarjuna31@gmail.com"
 *               password:
 *                 type: string
 *                 example: "password@31"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
 *       400:
 *         description: Invalid email or password
 */
router.post("/login",loginUser)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.post("/logout",logoutUser);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset link sent to email
 *       404:
 *         description: User not found
 */

router.post("/forgot-password", forgotPassword);



/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password using token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "your_jwt_token_here"
 *               newPassword:
 *                 type: string
 *                 example: "NewSecurePassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post("/reset-password", resetPassword);


/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "johndoe@example.com"
 *       401:
 *         description: Unauthorized (Invalid token)
 *       500:
 *         description: Server error
 */

router.get("/profile",authMiddleware,getUserDetails)



router.get("/users",getAllUsers);

router.delete("/delete/:id",deleteUser)

module.exports = router;
