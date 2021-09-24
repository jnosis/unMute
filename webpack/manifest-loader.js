module.exports = function makeManifest(content, mode, platform) {
  console.log('manifest loading...');
  let manifest = JSON.parse(content);

  console.log(`load ${platform} manifest...`);
  const { chrome, firefox, edge, whale, ...common } = manifest;
  switch (platform) {
    case 'chrome':
      manifest = { ...common, ...chrome };
      break;
    case 'firefox':
      manifest = { ...common, ...firefox };
      break;
    case 'edge':
      manifest = { ...common, ...edge };
    case 'whale':
      manifest = { ...common, ...whale };

    default:
      break;
  }

  const { commands, options_ui, ...rest } = manifest;
  if (mode) {
    console.log('load production manifest...');
    const { dev, ...prod } = commands;
    const { open_in_tab, ...options } = options_ui;
    manifest = { ...rest, commands: prod, options_ui: options };
  }

  console.log('manifest loaded');
  return JSON.stringify(manifest, null, 2);
};
