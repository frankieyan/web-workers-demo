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
