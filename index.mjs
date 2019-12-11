import { runAnimation } from './animation.mjs'

const fibMainButton = document.querySelector('#fib-main')
const fibWorkerButton = document.querySelector('#fib-worker')
const fibInput = document.querySelector('#fib-input')
const fibResults = document.querySelector('#fib-results')
const worker = new Worker('worker.js')

runAnimation()

fibMainButton.addEventListener('click', handleFibMain)
fibWorkerButton.addEventListener('click', handleFibWorker)

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
    const { data: result } = event
    console.log(`Completed in: ${performance.now() - startTime}ms`)
    fibResults.innerHTML = result
  }

  worker.postMessage({ length: fibInput.value })
}

// O(2^n) of death
function fibonacci(n) {
  if (n <= 1) {
    return n
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}
