module.exports = function makeManifest(content) {
  console.log('manifest loaded');
  let manifest = JSON.parse(content);
  delete manifest.commands.dev;

  return JSON.stringify(manifest);
};
