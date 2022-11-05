const fs = require('fs/promises');
const path = require('path');
const distPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');

async function clearDirectory(dirPath) {
  await fs.rm(dirPath, {recursive: true, force: true});
  await fs.mkdir(dirPath, {recursive: true});
}

async function createCssBundle(cssPath, bundlePath) {
  const files = await fs.readdir(cssPath, {withFileTypes: true});
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

async function copyDirectory(pathFrom, pathTo, recursive = true) {
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

async function generateHtmFile(templatePath, distPath, componentsPath) {
  let data = await fs.readFile(templatePath, 'utf8');
  let templateRegs = data.matchAll(/{{(.*?)}}/g);
  for (const templateReg of templateRegs) {
    let templateName = templateReg[1];
    let templateData = await fs.readFile(path.join(componentsPath, `${templateName}.html`), 'utf8');
    if(templateData) {
      data = data.replace(templateReg[0], templateData);
    }
  }
  
  await fs.appendFile(distPath, data, 'utf8');
}

(async () => {
  try {
    await clearDirectory(distPath);
    await generateHtmFile(path.join(__dirname, 'template.html'), path.join(distPath, 'index.html'), componentsPath);
    await createCssBundle(stylesPath, path.join(distPath, 'style.css'));
    await copyDirectory(path.join(__dirname, 'assets'), path.join(distPath, 'assets'));
  } catch (error) {
    console.log(error);
  }

})();