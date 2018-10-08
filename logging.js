var chalk = require('chalk');

/**
 * Log the HTTP request method, url and headers.
 */
module.exports = function(opts) {
  return function logging(req, res, next) {
    console.log( `${chalk.green(req.method)} ${chalk.cyan(req.url)}` );
    for (var key in req.headers) {
      console.log( `${chalk.blue(key.toUpperCase())}: ${req.headers[key]}` );
    }
    console.log('');
    next();
  };
};
