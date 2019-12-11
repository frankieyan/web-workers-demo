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

runAnimation()

fibMainButton.addEventListener('click', handleFibMain)
fibWorkerButton.addEventListener('click', handleFibWorker)

arrayMainButton.addEventListener('click', handleArrayMain)
arrayWorkerButton.addEventListener('click', handleArrayWorker)

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
    console.log(`Completed in: ${performance.now() - startTime}ms`)

    arrayResults.innerHTML = result
  }, 20)
}

function handleArrayWorker() {
  arrayResults.innerHTML = ''
  const startTime = performance.now()

  worker.onmessage = function onReceiveArrayResultsFromWorker(event) {
    const { type, result } = event.data
    if (type !== 'POPULATE_ARRAY') return

    console.log(`Completed in: ${performance.now() - startTime}ms`)
    arrayResults.innerHTML = result
  }

  worker.postMessage({ type: 'POPULATE_ARRAY', payload: arrayInput.value })
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
    .join(', ')
}
