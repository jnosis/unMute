module.exports = function makeManifest(content, mode, platform) {
  console.log('manifest loading...');
  let manifest = JSON.parse(content);

  console.log(`load ${platform} manifest...`);
  switch (platform) {
    case 'chrome':
      const chrome = { ...manifest.chrome };
      delete manifest.chrome;
      delete manifest.firefox;
      delete manifest.edge;
      delete manifest.whale;
      manifest = { ...manifest, ...chrome };
      break;
    case 'firefox':
      const firefox = { ...manifest.firefox };
      delete manifest.chrome;
      delete manifest.firefox;
      delete manifest.edge;
      delete manifest.whale;
      manifest = { ...manifest, ...firefox };
      break;
    case 'edge':
      const edge = { ...manifest.edge };
      delete manifest.chrome;
      delete manifest.firefox;
      delete manifest.edge;
      delete manifest.whale;
      manifest = { ...manifest, ...edge };
    case 'whale':
      const whale = { ...manifest.whale };
      delete manifest.chrome;
      delete manifest.firefox;
      delete manifest.edge;
      delete manifest.whale;
      manifest = { ...manifest, ...whale };

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
