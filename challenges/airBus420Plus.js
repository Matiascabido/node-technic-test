const Queue = require('bull')
const fs = require('fs')
const es = require('event-stream')
const path = require('path')
const PATH_FILE = path.join(__dirname, 'data', 'air_traffic.csv')
const SPLIT_SIMBOL = '\n'
const lineQueue = Queue('line_queue', 'redis://redis:6380')
const INFORMATION_TO_MATCH = 'A380'

// Lista de procesos.
lineQueue.process((job, done) => {
  setTimeout(() => {
    const counter = 0;
    const { data } = job;
    console.log(data); // aqui llega un objeto con la data de la linea.
    // Se llevan a cabo las tareas correspondientes, como guardar informacion en una db 
    const arrayLines = data.split(SPLIT_SIMBOL)
    for (const line of arrayLines) {
      line.includes(INFORMATION_TO_MATCH) ? counter =+ 1 : counter=+ 0
    }
    done()
  }, 2000);
})

// Solo sirve para archivos pesados
const airBus420Plus = () => {
  fs.createReadStream(PATH_FILE, 'utf-8')
  .pipe(es.split(SPLIT_SIMBOL))
  .on('data', (data) =>{
    console.log(data);
    lineQueue.add({data}, { // Se agrega { data } a la linea de procesos.
      attempts: 1 //cantidad de intentos
    })
  })
}

airBus420Plus()