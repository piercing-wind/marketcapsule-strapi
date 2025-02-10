const enocdeDecode = require('base64-url');


exports.encode = async (string) => {
   return enocdeDecode.encode(string);
}
exports.decode = async (string) => {
    const decodeString = enocdeDecode.decode(string);
    return JSON.parse(decodeString);
}