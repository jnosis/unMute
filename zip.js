const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const zipPath = path.join(__dirname, '/unmute.zip');
const distPath = path.join(__dirname, '/dist');
console.log(`\nChecking unmute.zip...`);
fs.rm(zipPath, async (err) => {
  if (!err) {
    console.log(`  Delete unmute.zip`);
  }

  try {
    console.log(`Checking ${distPath}...`);
    await fs.promises.access(distPath, fs.constants.F_OK);

    console.log(`Creating unmute.zip file...`);
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
    console.log(`  ${distPath} does not exist.`);
  }
});
