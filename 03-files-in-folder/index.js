const fs = require('fs/promises');
const path = require('path');
const secretFolder = path.join(__dirname, 'secret-folder');

async function getFilesInfo() {
  const files = await fs.readdir(secretFolder, {withFileTypes: true});

  files.forEach(async (f) => {
    if(f.isFile()) {
      const filePath = path.join(secretFolder, f.name);
      const fileExt = path.extname(filePath);
      const fileStats = await fs.stat(filePath);
      console.log(`${f.name.replace(fileExt, '')} - ${fileExt.replace('.', '')} - ${fileStats.size}b`);
    }
  });
}

(async () => {
  try {
   await getFilesInfo();
  } catch (error) {
    console.log(error)
  }
})();


