"use strict";

const crypto = require("crypto");

class PaytmChecksum {
  static encrypt(input, key) {
    // Ensure key length is 16 bytes
    key = PaytmChecksum.validateKey(key);

    const cipher = crypto.createCipheriv(
      "AES-128-CBC",
      key,
      Buffer.from(PaytmChecksum.iv)
    );
    let encrypted = cipher.update(input, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  }

  static decrypt(encrypted, key) {
    // Ensure key length is 16 bytes
    key = PaytmChecksum.validateKey(key);

    const decipher = crypto.createDecipheriv(
      "AES-128-CBC",
      key,
      Buffer.from(PaytmChecksum.iv)
    );
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  static validateKey(key) {
    // If key length is not 16 bytes, derive a 16-byte key using SHA-256
    if (key.length !== 16) {
      console.log(
        "Key length is not 16 bytes. Deriving a 16-byte key using SHA-256."
      );
      key = crypto.createHash("sha256").update(key).digest().slice(0, 16);
    }
    return key;
  }

  static generateSignature(params, key) {
    if (typeof params !== "object" && typeof params !== "string") {
      const error = "string or object expected, " + typeof params + " given.";
      return Promise.reject(error);
    }
    if (typeof params !== "string") {
      params = PaytmChecksum.getStringByParams(params);
    }
    return PaytmChecksum.generateSignatureByString(params, key);
  }

  static verifySignature(params, key, checksum) {
    if (typeof params !== "object" && typeof params !== "string") {
      const error = "string or object expected, " + typeof params + " given.";
      return Promise.reject(error);
    }
    if (params.hasOwnProperty("CHECKSUMHASH")) {
      delete params.CHECKSUMHASH;
    }
    if (typeof params !== "string") {
      params = PaytmChecksum.getStringByParams(params);
    }
    return PaytmChecksum.verifySignatureByString(params, key, checksum);
  }

  static async generateSignatureByString(params, key) {
    const salt = await PaytmChecksum.generateRandomString(4);
    return PaytmChecksum.calculateChecksum(params, key, salt);
  }

  static verifySignatureByString(params, key, checksum) {
    const paytm_hash = PaytmChecksum.decrypt(checksum, key);
    const salt = paytm_hash.substr(paytm_hash.length - 4);
    return paytm_hash === PaytmChecksum.calculateHash(params, salt);
  }

  static generateRandomString(length) {
    return new Promise(function (resolve, reject) {
      crypto.randomBytes((length * 3.0) / 4.0, function (err, buf) {
        if (!err) {
          const salt = buf.toString("base64");
          resolve(salt);
        } else {
          console.log("error occurred in generateRandomString: " + err);
          reject(err);
        }
      });
    });
  }

  static getStringByParams(params) {
    const data = {};
    Object.keys(params)
      .sort()
      .forEach(function (key) {
        data[key.toLowerCase()] =
          params[key] !== null && params[key].toLowerCase() !== "null"
            ? params[key]
            : "";
      });
    return Object.values(data).join("|");
  }

  static calculateHash(params, salt) {
    const finalString = params + "|" + salt;
    return crypto.createHash("sha256").update(finalString).digest("hex") + salt;
  }

  static calculateChecksum(params, key, salt) {
    const hashString = PaytmChecksum.calculateHash(params, salt);
    return PaytmChecksum.encrypt(hashString, key);
  }
}

PaytmChecksum.iv = "@@@@&&&&####$$$$";
module.exports = PaytmChecksum;
