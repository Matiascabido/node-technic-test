const fs = require('fs')
const path = require('path')

const PATH_FILE = path.join(__dirname, 'data', 'air_traffic.csv')
const SPLIT_SIMBOL = '\n'
const INFORMATION_TO_MATCH = 'A380'

// Solo sirve para archivos livianos
const airBus420 = () => {
  fs.readFile(PATH_FILE, 'utf-8', (err, data) => {
    let counter = 0;
    if (!err){
        const arrayLines = data.split(SPLIT_SIMBOL)
        for (const line of arrayLines) {
          line.includes(INFORMATION_TO_MATCH) ? counter =+ 1 : counter
        }
        console.log(counter);
    }else{
      console.log('ERROR >>', err);
    }
  })
  
}

airBus420()