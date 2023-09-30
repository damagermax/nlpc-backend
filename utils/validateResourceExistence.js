const ErrorResponse = require("./errorResponse");

const validateResourceExistence = (resource, resource_name, resource_id) => {
  const defaultMessage = "Resource not found";
  const customMessage = `${resource_name} with the givin id ${resource_id} does not exist`;

  const message = resource_name && resource_id ? customMessage : defaultMessage;

  if (!resource) throw new ErrorResponse(message, 404);
};

module.exports = validateResourceExistence;
