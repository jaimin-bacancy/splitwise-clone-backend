const crypto = require("crypto");

exports.generateUniqueId = (length = 12) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};
