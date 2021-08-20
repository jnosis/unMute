const fs = require('fs');
const archiver = require('archiver');

console.log(`\nChecking unmute.zip...`);
if (fs.existsSync(`${__dirname}/unmute.zip`)) {
  fs.unlinkSync(`${__dirname}/unmute.zip`);
  console.log(`Delete unmute.zip`);
}

console.log(`Checking /dist...`);
const isDist = fs.existsSync(`${__dirname}/dist`);
if (!isDist) {
  console.log(`/dist does not exist.`);
  return;
}

console.log('Creating unmute.zip file...');
const output = fs.createWriteStream(`${__dirname}/unmute.zip`);
const archive = archiver('zip', {
  zlib: { level: 9 },
});

output.on('close', () => {
  console.log(`File size: ${archive.pointer()} total bytes`);
  console.log('Archive has been created.');
});

archive.on('error', (error) => {
  throw error;
});

archive.pipe(output);
archive.directory(`${__dirname}/dist`, '').finalize();
