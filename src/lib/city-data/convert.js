const fs = require('fs')
const jsonfile = require('jsonfile')
const readline = require('readline')

const removeDoubleQuotes = (value) => value.replaceAll('"', '')

const txtToJson = (filename, columnNameMapping = {}, jsonFilePath) => {
  return new Promise((resolve, reject) => {
    console.log(`Converting ${filename}.txt to ${jsonFilePath}`)
    const txtFilePath = `./${filename}.txt`
    jsonFilePath = jsonFilePath || `./${filename}.json`
    const entries = []
    let i = 0
    let lineValues
    const mappedColumnIndexes = Object.keys(columnNameMapping).map((index) =>
      parseInt(index)
    )

    readline
      .createInterface({
        input: fs.createReadStream(txtFilePath),
        output: process.stdout,
        terminal: false
      })
      .on('line', function (line) {
        lineValues = line.split('\t')
        if (i !== 0) {
          entries.push(
            lineValues.reduce((entry, value, valueIndex) => {
              if (mappedColumnIndexes.includes(valueIndex)) {
                entry[columnNameMapping[valueIndex]] =
                  removeDoubleQuotes(value)
              }

              return entry
            }, {})
          )
        }
        i++
      })
      .on('close', function () {
        console.log(`Writing ${i} entries to ${jsonFilePath}`)
        jsonfile.writeFile(
          jsonFilePath,
          entries,
          { spaces: 2 },
          function (err) {
            if (err) {
              console.error(err)
              reject(err)
            } else {
              resolve()
            }
          }
        )
      })
  })
}

// geonameid         : integer id of record in geonames database
// name              : name of geographical point (utf8) varchar(200)
// asciiname         : name of geographical point in plain ascii characters, varchar(200)
// alternatenames    : alternatenames, comma separated, ascii names automatically transliterated, convenience attribute from alternatename table, varchar(10000)
// latitude          : latitude in decimal degrees (wgs84)
// longitude         : longitude in decimal degrees (wgs84)
// feature class     : see http://www.geonames.org/export/codes.html, char(1)
// feature code      : see http://www.geonames.org/export/codes.html, varchar(10)
// country code      : ISO-3166 2-letter country code, 2 characters
// cc2               : alternate country codes, comma separated, ISO-3166 2-letter country code, 200 characters
// admin1 code       : fipscode (subject to change to iso code), see exceptions below, see file admin1Codes.txt for display names of this code; varchar(20)
// admin2 code       : code for the second administrative division, a county in the US, see file admin2Codes.txt; varchar(80)
// admin3 code       : code for third level administrative division, varchar(20)
// admin4 code       : code for fourth level administrative division, varchar(20)
// population        : bigint (8 byte int)
// elevation         : in meters, integer
// dem               : digital elevation model, srtm3 or gtopo30, average elevation of 3''x3'' (ca 90mx90m) or 30''x30'' (ca 900mx900m) area in meters, integer. srtm processed by cgiar/ciat.
// timezone          : the iana timezone id (see file timeZone.txt) varchar(40)
// modification date : date of last modification in yyyy-MM-dd format
Promise.all([
  txtToJson(
    'cities1000',
    {
      0: 'id',
      8: 'country',
      1: 'name',
      4: 'lat',
      5: 'lng',
      10: 'admin1',
      11: 'admin2'
    },
    './cities.json'
  ),

  txtToJson(
    'admin1CodesASCII',
    {
      0: 'code',
      1: 'name'
    },
    './admin1.json'
  ),

  txtToJson(
    'admin2Codes',
    {
      0: 'code',
      1: 'name'
    },
    './admin2.json'
  ),

  txtToJson(
    'DE',
    {
      0: 'alternateNameId',
      1: 'geonameid',
      2: 'isolanguage',
      3: 'alternateName',
      4: 'isPreferredName',
      5: 'isShortName',
      6: 'isColloquial',
      7: 'isHistoric',
      8: 'from',
      9: 'to'
    },
    './DE.json'
  )
]).then(() => {
  console.log('Done creating JSON files')

  console.log('Starting to add German names to cities.json')

  const cities = JSON.parse(fs.readFileSync('./cities.json', 'utf8'))
  const germanNames = JSON.parse(fs.readFileSync('./DE.json', 'utf8'))

  // Add the German names to the cities
  cities.forEach((city) => {
    const germanNameEntry = germanNames.find(
      (entry) =>
        entry.geonameid === city.id &&
        entry.isolanguage === 'de' &&
        entry.isPreferredName === '1'
    )
    if (germanNameEntry) {
      // console.debug(germanNameEntry);
      const germanCity = {
        ...city,
        name: germanNameEntry.alternateName
      }
      cities.push(germanCity)
    }
  })

  // Write the updated cities back to the cities.json file
  fs.writeFileSync('./cities.json', JSON.stringify(cities, null, 2), 'utf8')

  console.log('Done adding German names to cities.json')
})
