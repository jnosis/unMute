module.exports = function addStorageLoggingCommandCode(content) {
  console.log('Adding storage logging command...');
  return content.replace(/\/\/\sfor\sDev\-/g, '');
};
