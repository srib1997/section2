var crypto = require('crypto');

function oneYearFromNow() {
  var date = new Date;
  date.setYear(date.getFullYear() + 1);
  return date;
}



function sign(value) {
 var secret = 'super duper secret';
 var signature = crypto
   .createHmac('sha256', secret)
   .update(value)
   .digest('base64');
 return value + '--' + signature;
}

function unsign(value) {
 var parts = value.split('--');
 var originalValue = parts[0];
 var checkedValue = sign(originalValue);
 if (checkedValue === value)
   return originalValue;
   else {
     return false;
   }
}

function getSession(req) {
 if (req.cookies['app_session']) {
   var unsigned = unsign(req.cookies['app_session']);
   if(unsigned)
   req.session = JSON.parse(unsigned);
   else {
     console.error('cookie signature no match');
     resetSession(req);
   }
 }else{
   resetSession(req);
 }
}


function setSession(req,res) {
 var expires = oneYearFromNow().toGMTString();
 var serialized = encodeURIComponent(sign(JSON.stringify(req.session)));
 res.setHeader('Set-Cookie', `app_session=${serialized}; Expires=${expires}; Path=/; HttpOnly`);
}

function resetSession(req) {
 req.session = {_id: crypto.randomBytes(8).toString('hex') };
}


module.exports = function(opts) {
  return function session(req, res, next) {
    getSession(req);
    req.resetSession = function () { resetSession(req); };
    var origEnd = res.end;
    res.end = function end() {
      setSession(req, res);
      return origEnd.apply(this, arguments);
    };
    next();
  };
};
