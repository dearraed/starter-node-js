const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const asyncHandler = require("express-async-handler");
const {
  BadRequestError,
  UnauthorizedError,
  AccessTokenError,
  TokenExpiredError,
  NotFoundError,
} = require("../middlewares/apiError");
const {
  SuccessResponse,
  SuccessMsgDataResponse,
} = require("../middlewares/apiResponse");

const UserRepo = require("../db/repositories/userRepo");
const { tokenInfo } = require("./../config");

const signToken = (id) => {
  return jwt.sign({ id }, tokenInfo.SECRET, {
    expiresIn: tokenInfo.ExpiresIn,
  });
};
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + tokenInfo.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  user.password = undefined;
  return new SuccessResponse({
    user,
    token,
  }).send(res);
};

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserRepo.findOneByObjSelect({ email }, "password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new BadRequestError("Incorrect email or password");
  }

  createSendToken(user, 200, req, res);
});

exports.signUp = asyncHandler(async (req, res) => {
  try {
    const checkUser = await UserRepo.findOneByObj({ email: req.body.email }); 
    if (checkUser) {
      throw new BadRequestError("A user with this email already exists");
    }
    const user = await UserRepo.create(...req.body)

    const token = signToken(user._id);

    return new SuccessResponse({
      user,
      token,
    }).send(res);
  } catch (err) {
    throw new BadRequestError(err.message);
  }
});

exports.getMe = asyncHandler(async (req, res) => {
  try {
    const freshUser = await UserRepo.findById(req.user.id);

    if (!freshUser) {
      throw new TokenExpiredError("Token expired");
    }
    return new SuccessResponse(freshUser).send(res);
  } catch (err) {
    throw new BadRequestError(err.message);
  }
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new AccessTokenError("No token provided");
  }
  try {
    const decoded = await promisify(jwt.verify)(token, tokenInfo.SECRET);
    const freshUser = await UserRepo.findById(decoded.id);
    if (!freshUser) {
      throw new UnauthorizedError(
        "The user belonging to this token does no longer exist."
      );
    }
   
    req.user = freshUser;
   
    next();
  } catch (err) {
    throw new BadRequestError(err.message);
  }
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError(
        "You do not have permission to perform this action"
      );
    }
    next();
  };
};

exports.updatePassword = asyncHandler(async (req, res) => {
  const user = await UserRepo.findOneByObjSelect(req.user._id, "password");
    if (!user)
    {
      throw new NotFoundError("User not found");
    }
  if (!(await user.correctPassword( req.body.currentPassword , user.password ))) {
    throw new BadRequestError("Your current password is wrong");
  }
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();
  const token = signToken(user._id);

  return new SuccessMsgDataResponse(token, "Password updated sucessfully").send(
    res
  );
});

exports.updateMe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const checkUser = await UserRepo.findOneByObj({ email });
  if (checkUser)
  {
    throw new BadRequestError('A user with this email already exists')
  }
 
  const user = await UserRepo.findByIdAndUpdate(req.user._id, { $set : req.body } ,{ new :true } );
    if (!user)
    {
      throw new NotFoundError("User not found");
    }

  return new SuccessMsgDataResponse(user, "Profile updated sucessfully").send(
    res
  );
});
