const { ApiError } = require("./apiError");

module.exports = (err, req, res, next) => {
  ApiError.handle(err, res);
};
