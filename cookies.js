module.exports = function(opts) {
  return function cookies(req, res, next) {
    var cookies = {};
    var pairs;
    if (req.headers.cookie) {
      pairs = req.headers.cookie.split(/; */);
      pairs.forEach((cookie) => {
        var parts = cookie.split('=');
        var key = parts[0];
        var value = decodeURIComponent(parts[1]);
        cookies[key] = value;
      });
    }
    req.cookies = cookies;

    next();
  };
};
