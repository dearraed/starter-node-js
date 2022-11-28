const authController = require("../../controllers/authController");
const { schemaValidator } = require("../../middlewares/schemaValidator");
const {
  signup,
  login,
  updatePassword,
  updateMe,
} = require("./schemas/authSchemas");
const express = require("express");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: The User managing API
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register
 *     tags: [Auth]
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       200:
 *         description: The list of the register
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 *
 *
 */

 router.post("/register", schemaValidator(signup), authController.signUp);


/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/LoginSchema'
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 *
 */

 router.post("/login", schemaValidator(login), authController.login);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get me
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Get me
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 *     security:
 *      - bearerAuth: []
 */

 router.route("/me").get(authController.protect, authController.getMe);

/**
 * @swagger
 * /updateMyPassword:
 *   put:
 *     summary: Password update
 *     tags: [Auth]
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/UpdatePassword'
 *     responses:
 *       200:
 *         description: Password update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Password'
 *     security:
 *      - bearerAuth: []
 */

 router
 .route("/updateMyPassword")
 .put(
   authController.protect,
   schemaValidator(updatePassword),
   authController.updatePassword
 );

/**
 * @swagger
 * /updateMe:
 *   put:
 *     summary: Update user's profile
 *     tags: [Auth]
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: Update user's profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 *     security:
 *      - bearerAuth: []
 */
 router
 .route("/updateMe")
 .put(
   authController.protect,
   schemaValidator(updateMe),
   authController.updateMe
 );

/**
 * @swagger
 * /forgotPassword:
 *   post:
 *     summary: forget password api
 *     tags: [Auth]
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/ForgetPassword'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                 status:
 *                  default : success 
 *                 message:
 *                  default: Token sent to email! 
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                 status:
 *                  default : fail 
 *                 message:
 *                  default: There was an error sending the email. Try again later!
 *     security:
 *      - bearerAuth: []
 */
 router.post('/forgotPassword', authController.forgotPassword);

 /**
 * @swagger
 * /resetPassword/{token}:
 *   patch:
 *     summary: reset password api
 *     tags: [Auth]
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/ResetPassword'
 *     parameters:
 *      - in: path
 *        name: token
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 */
 router.patch('/resetPassword/:token', authController.resetPassword);




module.exports = router;
