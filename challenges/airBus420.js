const Queue = require('bull')
const fs = require('fs')
const es = require('event-stream')
const path = require('path')

const lineQueue = Queue('line_queue', 'redis://redis:6380')

lineQueue.process((job, done) => {
  setTimeout(() => {
    const { data } = job;
    console.log(data); // aqui llega un objeto con la data de la linea.
    //console.log(Buffer.byteLength(data))
    done()
  }, 2000);
})

const PATH_FILE = path.join(__dirname, 'data', 'air_traffic.csv')
const SPLIT_SIMBOL = '\n'

const mainFunction = () => {

  
  // Solo sirve para archivos pesados

  fs.createReadStream(PATH_FILE, 'utf-8')
  .pipe(es.split(SPLIT_SIMBOL))
  .on('data', (data) =>{
    console.log(data);
    lineQueue.add({data}, {
      attempts: 1
    })
  })

  // Solo sirve para archivos livianos

  // fs.readFile(PATH_FILE, 'utf-8', (err, data) => {
  //   let counter = 0;
  //   if (!err){
  //      console.log(Buffer.byteLength(data))
  //       const arrayLines = data.split(SPLIT_SIMBOL)
  //       for (const line of arrayLines) {
  //         line.includes('A380') ? counter =+ 1 : counter
  //       }
  //       console.log(cunter);
  //   }else{
  //     console.log('ERROR >>', err);
  //   }
  // })
  
}

mainFunction()