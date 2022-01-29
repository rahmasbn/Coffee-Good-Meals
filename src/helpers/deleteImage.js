const fs = require('fs');

const deleteImage = (filename, folder) => {
  fs.unlink(`public/${folder}/${filename}`, (err) => {
    if (err) {
      console.log('fs error:', err);
    }
  });
};

module.exports = {deleteImage};
