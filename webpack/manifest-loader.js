module.exports = function makeManifest(content) {
  console.log('manifest loaded');
  let manifest = JSON.parse(content);
  delete manifest.commands.dev;
  delete manifest.options_ui.open_in_tab;

  return JSON.stringify(manifest, null, 2);
};
