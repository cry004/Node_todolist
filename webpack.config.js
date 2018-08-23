const path = require('path');

module.exports = {
  entry: './public/js/all.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public')
  }
};
