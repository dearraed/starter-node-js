const asyncHandler = require("express-async-handler");
const userModel = require("../db/models/userModel");
const ApiError = require("../middlewares/apiError");
const { BadRequestError , NotFoundError } = require("../middlewares/apiError");
const {
  SuccessMsgResponse,
  SuccessResponse,
  SuccessMsgDataResponse,
  SuccessResponsePagination,
} = require("../middlewares/apiResponse");

const UserRepo = require("../db/repositories/userRepo");



exports.getUser = asyncHandler(async (req, res) => {
  try {
    const user = await UserRepo.findById(req.params.id);
    if (!user) {
      throw new NotFoundError("No user found with that id");
    }
    return new SuccessResponse(user).send(res);
  } catch (err) {
    throw new BadRequestError(err.message);
  }
});
exports.createUser = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body.email;
    const checkUser = await UserRepo.findOneByObj({ email: req.body.email });
    if (checkUser) {
      throw new BadRequestError("A user with this email already exists");
    }
  
    let user = await UserRepo.create(req.body);
    let { password, ...data } = user._doc;
    return new SuccessMsgDataResponse(data, "User created successfully").send(
      res
    );
  } catch (err) {
    throw new BadRequestError(err.message);
  }
});
exports.getUsers = asyncHandler(async (req, res) => {
  try {
    const { page, perPage } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10,
    };
    const users = await UserRepo.findByObjPaginate({}, options);
    console.log(users);
    if (!users) {
      return new SuccessMsgResponse("No users found").send(res);
    }
    const { docs, ...meta } = users;

    return new SuccessResponsePagination(docs, meta).send(res);
  } catch (err) {
    throw new BadRequestError(err.message);
  }
});
exports.deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await UserRepo.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new NotFoundError(404, "No user found."));
    }
    return new SuccessMsgDataResponse(user, "User deleted successfully").send(
      res
    );
  } catch (err) {
    throw new BadRequestError(err.message);
  }
});
exports.updateUser = asyncHandler(async (req, res) => {
  try {
    if(req.body.email){
      const checkUser = await UserRepo.findOneByObj({_id: { $ne: req.params.id }, email: req.body.email });
      if (checkUser) {
        throw new BadRequestError("A user with this email already exists");
      }
    }
    const user = await UserRepo.findByIdAndUpdate( req.params.id, req.body);
    if (!user) {
      throw new NotFoundError("No user found with that id");
    }
    return new SuccessMsgDataResponse(user, "User updated successfully").send(
      res
    );
  } catch (err) {
    throw new BadRequestError(err.message);
  }
});


