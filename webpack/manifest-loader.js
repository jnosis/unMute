module.exports = function makeManifest(content, mode, platform) {
  console.log('manifest loading...');
  let manifest = JSON.parse(content);

  switch (platform) {
    case 'chrome':
      console.log('load chrome manifest...');
      const chrome = { ...manifest.chrome };
      delete manifest.chrome;
      delete manifest.firefox;
      manifest = { ...manifest, ...chrome };
      break;
    case 'firefox':
      console.log('load firefox manifest...');
      const firefox = { ...manifest.firefox };
      delete manifest.chrome;
      delete manifest.firefox;
      manifest = { ...manifest, ...firefox };
      break;

    default:
      break;
  }

  if (mode) {
    console.log('load production manifest...');
    delete manifest.commands.dev;
    delete manifest.options_ui.open_in_tab;
  }

  console.log('manifest loaded');
  return JSON.stringify(manifest, null, 2);
};
