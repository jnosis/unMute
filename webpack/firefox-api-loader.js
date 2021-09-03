module.exports = function addStorageLoggingCommandCode(content) {
  console.log(`Set firefox api...`);
  content = 'export const browser = self.browser;\n';
  return content;
};
