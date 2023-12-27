const http = require('https') // or 'https' for https:// URLs
const fs = require('fs')
const yauzl = require('yauzl')

const baseURL = 'https://download.geonames.org/export/dump/'
const downloadGeonameFile = (filename) => {
  const writeStream = fs.createWriteStream(filename)
  const fileURL = `${baseURL}${filename}`

  console.log(`Downloading ${fileURL}`)
  http.get(fileURL, (response) => {
    response.pipe(writeStream)
    writeStream.on('finish', () => {
      writeStream.close()
      console.log(`Download complete: ${filename}`)
    })
  })
}

downloadGeonameFile('admin1CodesASCII.txt')
downloadGeonameFile('admin2Codes.txt')

const txtFilenames = ['cities1000.txt', 'DE.txt']
const zipFilenames = ['cities1000.zip', 'alternatenames/DE.zip']
const localeZipFilenames = ['cities1000.zip', 'DE.zip']

zipFilenames.forEach((zipFilename, index) => {
  const zipFile = fs.createWriteStream(localeZipFilenames[index])
  http.get(`${baseURL}${zipFilename}`, (response) => {
    response.pipe(zipFile)

    zipFile.on('finish', () => {
      zipFile.close()
      console.log(`Download of ${baseURL}${zipFilename} Completed`)

      yauzl.open(
        localeZipFilenames[index],
        { lazyEntries: true },
        (err, zipfile) => {
          if (err) throw err
          zipfile.readEntry()
          zipfile.on('entry', (entry) => {
            if (entry.fileName === txtFilenames[index]) {
              const txtFile = fs.createWriteStream(entry.fileName)
              zipfile.openReadStream(entry, (err, readStream) => {
                if (err) {
                  throw err
                }
                readStream.on('end', function () {
                  zipfile.readEntry()
                })
                readStream.pipe(txtFile)
              })
              console.log(`Extracted ${entry.fileName}`)
            } else {
              zipfile.readEntry()
            }
          })
        }
      )
    })
  })
})
