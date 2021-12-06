const HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const Limit = {
  MAX_JSON: 15000,
  MAX_REQUEST_EACH_IP: 1000,
  TIME_15_MINUT: 15 * 60 * 1000,
};

module.exports = {
  HttpCode,
  Limit,
};
