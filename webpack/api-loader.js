module.exports = function addStorageLoggingCommandCode(content) {
  const options = this.getOptions();
  console.log(`Set ${options.platform} api...`);
  switch (options.platform) {
    case 'firefox':
      content = 'export const browser = self.browser;\n';
      break;
    case 'whale':
      content = content.replace(/chrome/g, 'whale');
      break;

    default:
      break;
  }
  return content;
};
