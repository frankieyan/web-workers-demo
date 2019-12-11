import { runAnimation } from './animation.mjs'

const worker = new Worker('worker.js')

const fibMainButton = document.querySelector('#fib-main')
const fibWorkerButton = document.querySelector('#fib-worker')
const fibInput = document.querySelector('#fib-input')
const fibResults = document.querySelector('#fib-results')

const arrayMainButton = document.querySelector('#array-main')
const arrayWorkerButton = document.querySelector('#array-worker')
const arrayInput = document.querySelector('#array-input')
const arrayResults = document.querySelector('#array-results')

const chunkMainButton = document.querySelector('#chunk-main')
const chunkWorkerButton = document.querySelector('#chunk-worker')
const chunkSourceInput = document.querySelector('#chunk-source-input')
const chunkIntervalInput = document.querySelector('#chunk-interval-input')
const chunkResults = document.querySelector('#chunk-results')

runAnimation()

fibMainButton.addEventListener('click', handleFibMain)
fibWorkerButton.addEventListener('click', handleFibWorker)

arrayMainButton.addEventListener('click', handleArrayMain)
arrayWorkerButton.addEventListener('click', handleArrayWorker)

chunkMainButton.addEventListener('click', handleChunkMain)
chunkWorkerButton.addEventListener('click', handleChunkWorker)

function handleFibMain() {
  fibResults.innerHTML = ''

  // Throwing this in a timeout to give the results element a chance to repaint
  setTimeout(() => {
    const startTime = performance.now()
    const result = fibonacci(fibInput.value)
    console.log(`Completed in: ${performance.now() - startTime}ms`)

    fibResults.innerHTML = result
  }, 20)
}

function handleFibWorker() {
  fibResults.innerHTML = ''
  const startTime = performance.now()

  worker.onmessage = function onReceiveFibResultsFromWorker(event) {
    const { type, result } = event.data
    if (type !== 'FIBONACCI') return

    console.log(`Completed in: ${performance.now() - startTime}ms`)
    fibResults.innerHTML = result
  }

  worker.postMessage({ type: 'FIBONACCI', payload: fibInput.value })
}

function handleArrayMain() {
  arrayResults.innerHTML = ''

  setTimeout(() => {
    const startTime = performance.now()
    const result = populateArray(arrayInput.value)

    const textNode = document.createTextNode(`Total array size processed: ${result.length}`)
    arrayResults.appendChild(textNode)
    console.log(`Completed in: ${performance.now() - startTime}ms`)
  }, 20)
}

function handleArrayWorker() {
  arrayResults.innerHTML = ''
  const startTime = performance.now()

  worker.onmessage = function onReceiveArrayResultsFromWorker(event) {
    const { type, result } = event.data
    if (type !== 'POPULATE_ARRAY') return
    const textNode = document.createTextNode(`Total array size processed: ${result.length}`)
    arrayResults.appendChild(textNode)
    console.log(`Completed in: ${performance.now() - startTime}ms`)
  }

  worker.postMessage({ type: 'POPULATE_ARRAY', payload: arrayInput.value })
}

function handleChunkMain() {
  chunkResults.innerHTML = ''

  setTimeout(async () => {
    const startTime = performance.now()
    const total = parseInt(chunkSourceInput.value, 10)
    const pageSize = parseInt(chunkIntervalInput.value, 10)
    const pages = Math.floor(total / pageSize)
    const remainder = total % pageSize
    let completed = 0

    const remaining = new Promise(resolve => resolve(populateChunk(total, total - remainder)))
    const chunks = Array.from(new Array(pages)).map((_, index) => {
      const start = (pages - index) * pageSize
      const end = start - pageSize
      return new Promise(resolve => {
        resolve(populateChunk(start, end))
      })
    })

    for await (let chunk of [remaining, ...chunks]) {
      completed += chunk.length
    }

    const textNode = document.createTextNode(`Total array size processed: ${completed}`)
    chunkResults.appendChild(textNode)
    console.log(`Completed in: ${performance.now() - startTime}ms`)
  }, 20)
}

function handleChunkWorker() {
  chunkResults.innerHTML = ''
  const startTime = performance.now()
  let firedMessages = 0
  let receivedMessages = 0
  let completed = 0

  worker.onmessage = function onReceiveChunkResultsFromWorker(event) {
    const { type, result } = event.data
    if (type !== 'POPULATE_CHUNK') return
    receivedMessages++

    completed += result.length

    if (receivedMessages == firedMessages) {
      const textNode = document.createTextNode(`Total array size processed: ${completed}`)
      chunkResults.appendChild(textNode)
      console.log(`Completed in: ${performance.now() - startTime}ms`)
    }
  }

  const total = parseInt(chunkSourceInput.value, 10)
  const pageSize = parseInt(chunkIntervalInput.value, 10)
  const pages = Math.floor(total / pageSize)
  const remainder = total % pageSize

  const remaining = { start: total, end: total - remainder }
  const chunks = Array.from(new Array(pages)).map((_, index) => {
    const start = (pages - index) * pageSize
    const end = start - pageSize

    return { start, end }
  })
  const allPayloads = [remaining, ...chunks]
  firedMessages = allPayloads.length

  allPayloads.forEach(payload => {
    worker.postMessage({ type: 'POPULATE_CHUNK', payload })
  })
}

// O(2^n) of death
function fibonacci(n) {
  if (n <= 1) {
    return n
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}

function populateArray(size) {
  return Array.from(new Array(parseInt(size, 10)))
    .map((_, index) => size - index)
}

function populateChunk(start, end) {
  return Array.from(new Array(parseInt(start, 10) - parseInt(end, 10)))
    .map((_, index) => start - index)
}
