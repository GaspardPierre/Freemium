const fs = require('fs');
const path = require('path');

function listFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      fileList = listFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function saveProjectStructure(projectPath, outputFile) {
  const allFiles = listFiles(projectPath);
  const projectStructure = {};

  allFiles.forEach((filePath) => {
    const relativePath = path.relative(projectPath, filePath);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const directories = relativePath.split(path.sep);

    let currentLevel = projectStructure;

    directories.forEach((dir, index) => {
      if (index === directories.length - 1) {
        currentLevel[dir] = fileContent;
      } else {
        currentLevel[dir] = currentLevel[dir] || {};
        currentLevel = currentLevel[dir];
      }
    });
  });

  fs.writeFileSync(outputFile, JSON.stringify(projectStructure, null, 2), 'utf8');
}

// Utilisation du script
// Remplacez 'path/to/your/project' par le chemin de votre projet
// et 'output.json' par le chemin où vous souhaitez enregistrer le fichier JSON
saveProjectStructure('/home/pierre/projets/freemium/back', '/home/pierre/projets/freemium/back/scripts/output.json');
