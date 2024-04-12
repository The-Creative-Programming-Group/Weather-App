import fs from "fs";
import http from "https"; // or 'https' for https:// URLs
import path from "path";
import type { Entry } from "yauzl";
import yauzl from "yauzl";

const directory = "./"; // specify the directory

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    if (
      file.endsWith(".json") ||
      file.endsWith(".jsonl") ||
      file.endsWith(".txt") ||
      file.endsWith(".zip")
    ) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) {
          // handle the error
          console.error(`Error while deleting file ${file}: `, err);
        }
      });
    }
  }

  const baseURL = "https://download.geonames.org/export/dump/";
  const downloadGeonameFile = (filename: string) => {
    const writeStream = fs.createWriteStream(filename);
    const fileURL = `${baseURL}${filename}`;

    console.log(`Downloading ${fileURL}`);
    http.get(fileURL, (response) => {
      response.pipe(writeStream);
      writeStream.on("finish", () => {
        writeStream.close();
        console.log(`Download complete: ${filename}`);
      });
    });
  };

  downloadGeonameFile("admin1CodesASCII.txt");
  downloadGeonameFile("admin2Codes.txt");

  const populationModifier = process.env.DEV_MODE === "true" ? 5000 : 1000;

  const txtFilenames = [`cities${populationModifier}.txt`, "DE.txt"];
  const zipFilenames = [
    `cities${populationModifier}.zip`,
    "alternatenames/DE.zip",
  ];
  const localeZipFilenames = [`cities${populationModifier}.zip`, "DE.zip"];

  zipFilenames.forEach((zipFilename, index) => {
    const localeZipFilename = localeZipFilenames[index];
    if (localeZipFilename === undefined) {
      throw new Error(`No locale zip filename found at index ${index}`);
    }
    const zipFile = fs.createWriteStream(localeZipFilename);
    http.get(`${baseURL}${zipFilename}`, (response) => {
      response.pipe(zipFile);

      zipFile.on("finish", () => {
        zipFile.close();
        console.log(`Download of ${baseURL}${zipFilename} Completed`);

        yauzl.open(localeZipFilename, { lazyEntries: true }, (err, zipfile) => {
          if (err) throw err;
          zipfile.readEntry();
          zipfile.on("entry", (entry: Entry) => {
            if (entry.fileName === txtFilenames[index]) {
              const txtFile = fs.createWriteStream(entry.fileName);
              zipfile.openReadStream(entry, (err, readStream) => {
                if (err) {
                  throw err;
                }
                readStream.on("end", function () {
                  zipfile.readEntry();
                });
                readStream.pipe(txtFile);
              });
              console.log(`Extracted ${entry.fileName}`);
            } else {
              zipfile.readEntry();
            }
          });
        });
      });
    });
  });
});
