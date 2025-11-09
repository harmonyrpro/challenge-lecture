import fs from "fs";
import path from "path";

const uploadDir = path.resolve("upload");
const outputFile = path.resolve("files.json");

let files = fs.readdirSync(uploadDir);

// tri numérique sur le numéro initial
files.sort((a, b) => {
  const getNumber = name => {
    const match = name.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };
  return getNumber(a) - getNumber(b);
});

const fileList = files.map((fileName, index) => {
  const filePath = path.join(uploadDir, fileName);
  const stats = fs.statSync(filePath);

  // enlever le numéro initial + point + espace éventuel
  const nameWithoutNumber = fileName.replace(/^\d+\s*\.?\s*/, '');
  const nameWithoutExt = path.parse(nameWithoutNumber).name;

  return {
    id: index + 1,
    name: nameWithoutExt,
    path: `upload/${fileName}`,
    size: stats.size,
    modified: stats.mtime
  };
});

fs.writeFileSync(outputFile, JSON.stringify(fileList, null, 2), "utf8");

console.log(`✅ JSON créé avec ${fileList.length} fichiers triés et nom nettoyé : ${outputFile}`);
