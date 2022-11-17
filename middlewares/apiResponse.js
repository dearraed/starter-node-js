const ResponseStatus = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 422,
    INTERNAL_ERROR: 500,
  };


  const StatusCode = {
    SUCCESS : "success",
    FAILURE : "fail"
  }
  
  class ApiResponse {
    constructor(statusCode, status, message) {
      this.statusCode = statusCode;
      this.status = status;
      this.message = message;
    }
  
    send(res) {
      return res
        .status(this.statusCode)
        .json({ status: this.status, message: this.message });
    }
  }

  class ApiResponseData {
    constructor(statusCode, status, data, message) {
      this.statusCode = statusCode;
      this.status = status;
      this.data = data;
      
    }
  
    send(res) {
      return res
        .status(this.statusCode)
        .json({ status: this.status, data: this.data });
    }
  }

  class ApiResponseDataMsg {
    constructor(statusCode, status, data, message) {
      this.statusCode = statusCode;
      this.status = status;
      this.data = data;
      this.message = message
    }
  
    send(res) {
      return res
        .status(this.statusCode)
        .json({ status: this.status, message: this.message, data: this.data });
    }
  }


  class ApiResponseDataMeta{
    constructor(statusCode, status, data, meta) {
      this.statusCode = statusCode;
      this.status = status;
      this.data = data;
      this.meta = meta
    }
  
    send(res) {
      return res
        .status(this.statusCode)
        .json({ status: this.status, data: this.data, meta: this.meta });
    }
  }
  
  class BadRequestResponse extends ApiResponse {
    constructor(message = "Bad Parameters") {
      super(ResponseStatus.BAD_REQUEST, "fail", message);
    }
  }
  
  class NotFoundResponse extends ApiResponse {
    constructor(message = "Not Found") {
      super(ResponseStatus.NOT_FOUND, StatusCode.FAILURE, message);
    }
  }
  class ValidationFailResponse extends ApiResponse {
    constructor(message = "Validation Error") {
      super(ResponseStatus.VALIDATION_ERROR, StatusCode.FAILURE, message);
    }
  }
  class InternelResponse extends ApiResponse {
    constructor(message = "Server Error") {
      super(ResponseStatus.INTERNAL_ERROR, StatusCode.FAILURE, message);
    }
  }
  class AuthFailureResponse extends ApiResponse {
    constructor(message = "Login Error") {
      super(ResponseStatus.UNAUTHORIZED, StatusCode.FAILURE, message);
    }
  }
  class SuccessResponse extends ApiResponseData {
    constructor(data) {
      super(ResponseStatus.SUCCESS, StatusCode.SUCCESS, data);
    }
  }


  class SuccessMsgDataResponse extends ApiResponseDataMsg {
    constructor(data, message) {
      super(ResponseStatus.SUCCESS, StatusCode.SUCCESS, data, message);
    }
  }
  class SuccessResponsePagination extends ApiResponseDataMeta {
    constructor(data, meta) {
      super(ResponseStatus.SUCCESS, StatusCode.SUCCESS, data, meta);
    }
  }
  class SuccessMsgResponse extends ApiResponse {
    constructor(message = "Successful") {
    super(ResponseStatus.SUCCESS, StatusCode.SUCCESS, message);
  }
}

  
  module.exports = {
    SuccessResponse,
    SuccessMsgDataResponse  ,
    SuccessMsgResponse,
    BadRequestResponse,
    NotFoundResponse,
    ValidationFailResponse,
    InternelResponse,
    AuthFailureResponse,
    SuccessResponsePagination
    
  };
  