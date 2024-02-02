import fs from 'fs'
import jsonl from 'jsonl'

fs.createReadStream('./city-list.json')
  .pipe(jsonl())
  .pipe(fs.createWriteStream('./city-list.jsonl'))
