const {
  BadRequestResponse,
  NotFoundResponse,
  ValidationFailResponse,
  InternelResponse,
  AuthFailureResponse,
} = require("../middlewares/apiResponse");
const environment = require("../config");

const ErrorType = {
  BAD_TOKEN: "BadTokenError",
  TOKEN_EXPIRED: "TokenExpiredError",
  UNAUTHORIZED: "AuthFailureError",
  ACCESS_TOKEN: "AccessTokenError",
  INTERNAL: "InternalError",
  NOT_FOUND: "NotFoundError",
  NO_ENTRY: "NoEntryError",
  NO_DATA: "NoDataError",
  BAD_REQUEST: "BadRequestError",
  FORBIDDEN: "ForbiddenError",
  VALIDATION_FAIL: "ValidationFail",
};

class ApiError extends Error {
  constructor(type, message) {
    super(message);
    this.type = type;
  }

  static handle(err, res) {
    switch (err.type) {
      case ErrorType.UNAUTHORIZED:
        return new AuthFailureResponse(err.message).send(res);
      case ErrorType.NOT_FOUND:
      case ErrorType.NO_DATA:
        return new NotFoundResponse(err.message).send(res);
      case ErrorType.BAD_REQUEST:
        return new BadRequestResponse(err.message).send(res);
      case ErrorType.VALIDATION_FAIL:
        return new ValidationFailResponse(err.message).send(res);
      default: {
        let message = err.message;
        if (environment === "production")
          message = "Something wrong happened.";
        return new InternelResponse(message).send(res);
      }
    }
  }
}

class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(ErrorType.BAD_REQUEST, message);
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(ErrorType.NOT_FOUND, message);
  }
}

class NoDataError extends ApiError {
  constructor(message = "No data available") {
    super(ErrorType.NO_DATA, message);
  }
}
class ValidationError extends ApiError {
  constructor(message = "Validation Fail") {
    super(ErrorType.VALIDATION_FAIL, message);
  }
}
class UnauthorizedError extends ApiError {
  constructor(message = "Login Failed") {
    super(ErrorType.UNAUTHORIZED, message);
  }
}
class AccessTokenError extends ApiError {
  constructor(message = "Token Error") {
    super(ErrorType.ACCESS_TOKEN, message);
  }
}
class TokenExpiredError extends ApiError {
  constructor(message = "Access token error") {
    super(ErrorType.TOKEN_EXPIRED, message);
  }
}




module.exports = {
  ApiError,
  NoDataError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ValidationError,
  AccessTokenError,
  TokenExpiredError
};
