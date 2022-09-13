function handleGetRandoms(cant) {
    const numbers = {}
    for (let i = 0; i < cant; i++) {
      const tempNum = Math.floor(Math.random() * 999 + 1)
      numbers[tempNum] = numbers[tempNum] ? numbers[tempNum] + 1 : 1
    }
    return numbers
  }

  process.on('exit', () => {
    console.log(`worker #${process.pid} | GetRandoms cerrado`)
  })

  process.on('message', msg => {
    console.log(`worker #${process.pid} | GetRandoms iniciando la tarea`)
    if (!isNaN(msg)) {
      const numbers = handleGetRandoms(msg)
      process.send(numbers)
      console.log(`worker #${process.pid} | GetRandoms finalizó la tarea`)
      process.exit()
    }
  })

  process.send('listo')