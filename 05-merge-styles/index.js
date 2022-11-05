const fs = require('fs/promises');
const path = require('path');
const distPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');

async function createCssBundle(cssPath, bundlePath) {
  const files = await fs.readdir(cssPath, {withFileTypes: true});
  
  await fs.rm(bundlePath, {force: true});
 
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(cssPath, file.name);
      await appendDataToFile(filePath, bundlePath)
    }
  }
}

async function appendDataToFile(srcPath, distPath) {
  let data = await fs.readFile(srcPath, 'utf8');
  await fs.appendFile(distPath, data + '\n', 'utf8');
}

(async () => {
  try {
    await createCssBundle(stylesPath, path.join(distPath, 'bundle.css'));
  } catch (error) {
    console.log(error);
  }
})();