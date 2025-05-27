const fs = require('fs');
const path = require('path');

/**
 * Deletes a file at the given file path.
 * @param {string} filePath - The path to the file to delete.
 * @returns {Promise<void>} Resolves if file is deleted, rejects if error occurs.
 */
function deleteFile(filePath) {
  filePath = path.join(__dirname, filePath);
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

/**
 * Deletes multiple files given an array of file paths.
 * @param {string[]} filePaths - Array of file paths to delete.
 * @returns {Promise<void[]>} Resolves when all files are deleted, rejects if any error occurs.
 */
function deleteFiles(filePaths) {
  return Promise.all(filePaths.map(deleteFile));
}

module.exports = { deleteFile, deleteFiles };
