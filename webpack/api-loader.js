module.exports = function addStorageLoggingCommandCode(content) {
  const options = this.getOptions();
  console.log(`Set ${options.platform} api...`);
  switch (options.platform) {
    case 'firefox':
      content = content.replace('isChromium = true', 'isChromium = false');
      break;
    case 'whale':
      content = content.replace(/chrome/g, 'whale');
      break;

    default:
      break;
  }
  return content;
};
