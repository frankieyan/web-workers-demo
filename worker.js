addEventListener('message', event => {
  const { length } = event.data
  let data = []

  while(data.length < length) {
    data.push('block')
  }

  console.log(`Processed ${data.length} items`)
  console.log({ data })
  data = null
})
