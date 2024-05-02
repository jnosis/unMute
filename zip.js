const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const platform = process.argv[2];
const zipPath = path.join(__dirname, `/unmute-${platform}.zip`);
const distPath = path.join(__dirname, `/dist/${platform}`);
console.log(`Checking unmute-${platform}.zip...`);
fs.rm(zipPath, async (err) => {
  if (!err) {
    console.log(`  Delete unmute-${platform}.zip`);
  }

  try {
    console.log(`Checking ${distPath}...`);
    await fs.promises.access(distPath, fs.constants.F_OK);

    console.log(`Creating unmute-${platform}.zip file...`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    output.on('close', () => {
      console.log('  Archive has been created.');
      console.log(`  File size: ${archive.pointer()} total bytes`);
    });

    archive.on('error', (error) => {
      throw error;
    });

    archive.pipe(output);
    archive.directory(distPath, '').finalize();
  } catch (error) {
    if (error.code === 'ENOENT') console.log(`  ${distPath} does not exist.`);
    else throw error;
  }
});
