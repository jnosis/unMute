module.exports = function addStorageLoggingCommandCode(content) {
  console.log(`Set firefox api...`);
  return content.replace(/import { browser } from ..\/Api\/api/, '');
};
