
const fs = require('fs').promises
const path = require('path')


function getJsonData(fileName) {
    const filePath = path.resolve(__dirname, '../data', `${fileName}.json`)
    console.log(`Reading data from ${filePath}`)
    return fs.readFile(filePath, 'utf-8')
        .then(data => JSON.parse(data))
        .catch(err => {
            console.error(`Error reading or parsing ${fileName}:`, err)
            return null
        })
}

module.exports = {
    getJsonData,
}
