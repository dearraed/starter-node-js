const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const asyncHandler = require("express-async-handler");
const crypto = require('crypto');
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
  SuccessMsgResponse,
} = require("../middlewares/apiResponse");

const UserRepo = require("../db/repositories/userRepo");
const { tokenInfo } = require("./../config");
const sendEmail = require("./../utils/email")

const signToken = (id) => {
  return jwt.sign({ id }, tokenInfo.secret, {
    expiresIn: tokenInfo.expireIn,
  });
};
const createSendToken = (user, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + tokenInfo.jwtCookieExpireIn * 24 * 60 * 60 * 1000
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

  if(!user || ! (await user.correctPassword(password, user.password)))  {
    throw new BadRequestError("Incorrect email or password");
  }
  createSendToken(user, req, res);
});

exports.signUp = asyncHandler(async (req, res) => {

  const checkUser = await UserRepo.findOneByObj({ email: req.body.email }); 
    if (checkUser) {
      throw new BadRequestError("A user with this email already exists");
    }
    const user = await UserRepo.create(req.body)
    user.password = undefined;
    const token = signToken(user._id);

    return new SuccessResponse({
      user,
      token,
    }).send(res);

});

exports.getMe = asyncHandler(async (req, res) => {

    const freshUser = await UserRepo.findById(req.user.id);

    if (!freshUser) {
      throw new TokenExpiredError("Token expired");
    }
    return new SuccessResponse(freshUser).send(res);
 
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new AccessTokenError("No token provided");
  }

  const decoded = await promisify(jwt.verify)(token, tokenInfo.secret);
  const freshUser = await UserRepo.findById(decoded.id);
  if (!freshUser) {
    throw new UnauthorizedError(
      "The user belonging to this token does no longer exist."
    );
  }
  
  req.user = freshUser;
  
  next();
 
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
  
  const checkUser = await UserRepo.findOneByObj({_id: { $ne: req.user._id }, email: req.body.email });
  if (checkUser)
  {
    throw new BadRequestError('A user with this email already exists')
  }
 
  const user = await UserRepo.findByIdAndUpdate(req.user._id, req.body);
    if (!user)
    {
      throw new NotFoundError("User not found");
    }

  return new SuccessMsgDataResponse(user, "Profile updated sucessfully").send(
    res
  );
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await UserRepo.findOneByObj({ email: req.body.email });
  if (!user) {
    throw new NotFoundError('There is no user with email address.');
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
 
  // 3) Send it to user's email
  const resetURL = req.protocol + '://' + req.get('host') + '/api/v1/users/resetPassword/' + resetToken;

  const message = 'Forgot your password? \nSubmit a PATCH request with your new password and passwordConfirm to: ' + resetURL + '.\nIf you didn\'t forget your password, please ignore this email!';
 
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

   return new SuccessMsgResponse('Token sent to email!').send(res);
    
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new BadRequestError('There was an error sending the email. Try again later!');
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await UserRepo.findOneByObj({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    throw new TokenExpiredError('Token is invalid or has expired');
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, req, res);
});
