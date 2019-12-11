addEventListener('message', event => {
  const { length } = event.data
  const result = fibonacci(length)
  postMessage(result)
})

// O(2^n) of death
function fibonacci(n) {
  if (n <= 1) {
    return n
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}
