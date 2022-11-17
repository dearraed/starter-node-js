const Joi = require("joi");
const { JoiObjectId } = require("../../../middlewares/schemaValidator");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - lastName 
 *         - email 
 *         - password 
 *         - passwordConfirm 
 *         - tel 
 *         - work 
 *       properties:
 *         name:
 *           type: string
 *           description: The username
 *         lastName:
 *           type: string
 *           description: The last name
 *         email:
 *           type: string
 *           description: Email address
 *         password:
 *           type: string
 *           description: Minimum of 8 characters long
 *         passwordConfirm:
 *           type: string
 *           description: Should match with the password
 *         tel:
 *           type: string
 *           description: Should be 8 characters long
 *         work:
 *           type: string
 *           description: User's work
 *     Password:
 *       type: object
 *       properties:
 *         currentPassword:
 *          type: string
 *          description: user's current password   
 *         newPassword:
 *          type: string
 *          description: user's new password
 *         newPasswordConfirm:
 *          type: string
 *          description: user's new password confirmation
 *         
                
 */


exports.createUser = Joi.object({
  name: Joi.string().trim().min(3).max(30).required(),
  lastName: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().min(3).required().email(),
  password: Joi.string().min(8).required().regex(/^[a-zA-Z0-9]{8,30}$/),    
  passwordConfirm:Joi.string().min(8).required().valid(Joi.ref('password')).regex(/^[a-zA-Z0-9]{8,30}$/),
  tel:Joi.string().length(8).required(),
  work:Joi.string().min(3).required()
   
  });
exports.updateUser = Joi.object({
  name: Joi.string().trim().min(3).max(30).optional(),
  lastName: Joi.string().trim().min(3).max(30).optional(),
  email: Joi.string().min(3).email().optional(),
  password: Joi.string().min(8).regex(/^[a-zA-Z0-9]{8,30}$/).optional(),    
  passwordConfirm:Joi.string().min(8).valid(Joi.ref('password')).regex(/^[a-zA-Z0-9]{8,30}$/).optional(),
  tel:Joi.string().length(8).optional(),
  work:Joi.string().min(3).optional()
   
  });

exports.getUsers=Joi.object({
  name: Joi.string().trim().min(3).max(30).optional(),
  lastName: Joi.string().trim().min(3).max(30).optional(),
  email: Joi.string().min(3).optional().email(),
  tel:Joi.string().length(8).optional(),
  work:Joi.string().min(3).optional(),
  page:Joi.number().optional(),
  perPage:Joi.number().optional()

})
exports.checkUserId=Joi.object({
  id:JoiObjectId().required()
})
