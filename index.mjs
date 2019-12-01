import { runAnimation } from './animation.mjs'

const startMainButton = document.querySelector('#start-main')
const startWorkerButton = document.querySelector('#start-worker')
const dataContainer = document.querySelector('#data')
const worker = new Worker('worker.js')
const length = 100000000

runAnimation()

startMainButton.addEventListener('click', () => {
  let data = []

  while(data.length < length) {
    data.push('block')
  }

  console.log(`Processed ${data.length} items`)
  console.log({ data })
  data = null
})

startWorkerButton.addEventListener('click', () => {
  worker.onmessage = event => {
    const { data } = event
    console.log(data)
  }

  worker.postMessage({ length })
})

function renderData(data) {
  dataContainer.innerHTML = ''

  data.forEach((item, index) => {
    setTimeout(() => {
      console.log(`Processing DOM node for item #${index}`)
      const newNode = document.createElement('span')
      newNode.innerText = `${item}, `
      dataContainer.appendChild(newNode)
    })
  })

  console.log('Done queueing DOM nodes')
}
