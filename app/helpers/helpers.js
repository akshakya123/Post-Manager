const RESPONSE = {
    ERROR: {
      DATA_NOT_FOUND: (msg,data) => {
      let obj = {
          statusCode: 404,
          status: false,
          message: msg || '',
          type: 'DATA_NOT_FOUND',
      };
          if (data) {
              obj = { ...obj, data };
          }
          return obj;
      },
      BAD_REQUEST: (msg, data) => {
        let obj = {
          statusCode: 400,
          status: false,
          message: msg || '',
          type: 'BAD_REQUEST',
        };
        if (data) {
          obj = { ...obj, data };
        }
        return obj;
      },
      MONGO_EXCEPTION: (msg,data) => {
        let obj = {
          statusCode: 400,
          status: false,
          message: msg || '',
          type: 'BAD_REQUEST',
      };
          if (data) {
              obj = { ...obj, data };
          }
          return obj;
      },
      FORBIDDEN: (msg,data) => {
        let obj = {
          statusCode: 403,
          status: false,
          message: msg || '',
          type: 'FORBIDDEN',
        };
        if (data) {
          obj = { ...obj, data };
        }
        return obj;
      },
      INTERNAL_SERVER_ERROR: (msg,data) => {
        let obj = {
          statusCode: 500,
          status: false,
          message: msg || '',
          type: 'INTERNAL_SERVER_ERROR',
        };
        if (data) {
          obj = { ...obj, data };
        }
        return obj;
      },
      UNAUTHORIZED: (msg,data) => {
        let obj = {
          statusCode: 401,
          status: false,
          message: msg || '',
          type: 'UNAUTHORIZED',
        };
        if (data) {
          obj = { ...obj, data };
        }
        return obj;
      },
    },
    SUCCESS: {
      MISSCELANEOUSAPI: (msg, data) => {
        let obj = {
          statusCode: 200,
          status: true,
          message: msg || '',
          type: 'SUCCESS',
        };
        if (data) {
          obj = { ...obj, data };
        }
        return obj;
      },
    },
  };
  
  function createSuccessResponse(message, data) {
    return RESPONSE.SUCCESS.MISSCELANEOUSAPI(message, data);
  }
  
  function createErrorResponse(message, errorType, data) {
    return RESPONSE.ERROR[errorType](message, data);
  }
  
  module.exports = {
    createErrorResponse,
    createSuccessResponse,
  };
  