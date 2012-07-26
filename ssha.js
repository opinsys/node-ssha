// Backported from Node.js 0.8 for Node 0.6 support.
bufferConcat = function(list, length) {
  if (!Array.isArray(list)) {
    throw new Error('Usage: Buffer.concat(list, [length])');
  }

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  if (typeof length !== 'number') {
    length = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      length += buf.length;
    }
  }

  var buffer = new Buffer(length);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};


var crypto = require("crypto");


/**
* @param {String} secret string
* @param {Buffer} Predefined salt buffer (optional)
* @return {String} salted string hash
*/
var create = function(secret, salt) {
  var buf, digest, hash;
  if (!salt) {
    salt = crypto.randomBytes(32);
  }
  secret = new Buffer(secret);
  hash = crypto.createHash("sha1");
  hash.update(secret);
  hash.update(salt);
  digest = new Buffer(hash.digest("base64"), "base64");
  buf = bufferConcat([digest, salt]);
  return "{SSHA}" + buf.toString("base64");
};


/**
* @param {String} secret string
* @param {String} salted string hash
* @return {Boolean}
*/
var verify = function(secret, sshaHash) {
  var base64, buf, salt;
  base64 = sshaHash.slice(6);
  buf = new Buffer(base64, "base64");
  salt = buf.slice(20);
  return create(secret, salt) === sshaHash;
};


module.exports = {
  create: create,
  verify: verify
};


// Poor man's test case
if (require.main === module) {
  assert = require("assert");
  sshaHash = create("foobar");
  console.info("HASH", sshaHash);
  assert(verify("foobar", sshaHash));
}
