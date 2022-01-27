const fs = require('fs');

const deleteImage = (filename, type) => {
  const folder = type === 'users' ? 'users' : 'products';
  console.log(filename, type, folder);
  fs.unlink(`public/${folder}/${filename}`, (err) => {
    if (err) {
      console.log('fs error:', err);
    }
  });
};

module.exports = {deleteImage};
