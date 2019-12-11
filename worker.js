addEventListener('message', event => {
  const { type, payload } = event.data

  switch (type) {
    case 'FIBONACCI': {
      const result = fibonacci(payload)
      return postMessage({ type: 'FIBONACCI', result })
    }

    case 'POPULATE_ARRAY': {
      const result = populateArray(payload)
      return postMessage({ type: 'POPULATE_ARRAY', result })
    }

    case 'POPULATE_CHUNK': {
      const { start, end } = payload
      const result = populateChunk(start, end)
      postMessage({ type: 'POPULATE_CHUNK', result })
    }

    default:
      return
  }
})

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

function populateChunk(start, end) {
  return Array.from(new Array(parseInt(start, 10) - parseInt(end, 10)))
    .map((_, index) => start - index)
    .join(', ')
}
