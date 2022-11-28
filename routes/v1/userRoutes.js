const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const authController = require("../../controllers/authController");
const {
  createUser,
  updateUser,
  getUsers,
  checkUserId,
} = require("./schemas/userSchemas");
const { schemaValidator } = require("../../middlewares/schemaValidator");


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [User]
 *     parameters:
 *        - in: query
 *          name: search
 *          schema:
 *            type: string
 *        - in: query
 *          name: name
 *          schema:
 *            type: string
 *        - in: query
 *          name: work
 *          schema:
 *            type: string
 *        - in: query
 *          name: email
 *          schema:
 *            type: string
 *        - in: query
 *          name: lastName
 *          schema:
 *            type: string
 *        - in: query
 *          name: tel
 *          schema:
 *            type: integer
 *        - in: query
 *          name: deleted
 *          schema:
 *            type: string
 *        - in: query
 *          name: sort
 *          schema:
 *            type: string
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *        - in: query
 *          name: perPage
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *     security:
 *      - bearerAuth: []
 */

 router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  schemaValidator(getUsers, "query"),
  userController.getUsers
);


/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get one user by id
 *     tags: [User]
 *     parameters:
 *      - in: path
 *        name: id
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 *     security:
 *      - bearerAuth: []
 */

 router
 .route("/:id")
 .get(
   authController.protect,
   authController.restrictTo("admin"),
   schemaValidator(checkUserId, "params"),
   userController.getUser
 );


/**
 * @swagger
 * /users:
 *   post:
 *     summary: User Creation
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/CreateUser'
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 *     security:
 *      - bearerAuth: []
 *
 */

 router.post(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  schemaValidator(createUser),
  userController.createUser
);


/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: update one user by id
 *     tags: [User]
 *     parameters:
 *      - in: path
 *        name: id
 *     requestBody:
 *         required: true
 *         content:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 *     security:
 *      - bearerAuth: []
 */

 router.put(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  schemaValidator(checkUserId, "params"),
  schemaValidator(updateUser),
  userController.updateUser
);


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: delete one user by id
 *     tags: [User]
 *     parameters:
 *      - in: path
 *        name: id
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 *     security:
 *      - bearerAuth: []
 */

 router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  schemaValidator(checkUserId, "params"),
  userController.deleteUser
);



module.exports = router;
