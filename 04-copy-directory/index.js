const fs = require('fs/promises');
const path = require('path');
const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

async function copyDirectory(pathFrom, pathTo, recursive = true) {
  await fs.rm(pathTo, {recursive: true, force: true});
  await fs.mkdir(pathTo, {recursive: true});
  const files = await fs.readdir(pathFrom, {withFileTypes: true});
  for (const file of files) {
    if(file.isDirectory()) {
      if(recursive) await copyDirectory(path.join(pathFrom, file.name), path.join(pathTo, file.name), recursive);
    } else {
      await fs.copyFile(path.join(pathFrom, file.name), path.join(pathTo, file.name));
    }
  }
}

(async () => {
  try {
   await copyDirectory(srcPath, destPath);
  } catch (error) {
    console.log(error)
  }
})();
