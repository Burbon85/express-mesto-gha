const http2 = require('node:http2');

const Server = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = Server;
  }
}

module.exports = ServerError;
