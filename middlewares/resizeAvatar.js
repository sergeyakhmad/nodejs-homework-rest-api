const Jimp = require("jimp");

const getResizeAvatar = (path) => {
  return Jimp.read(path)
    .then((avatar) => {
      return avatar.resize(250, 250).write(path);
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = getResizeAvatar;
