module.exports = function addStorageLoggingCommandCode(content) {
  console.log('Disabling storage logging command...');
  return content.replace(
    /\/\/ Dev Code: start([\s\w\d(){}[\]>=<`'";:.,!?&|\\^$#%+_~-]|\/[^\/])*\/\/ Dev Code: end/g,
    ''
  );
};
