let animationFrame

const animatedBall = document.querySelector('#animated-ball')
const { height, width, left, right, x, } = animatedBall.getBoundingClientRect()
const speed = 6

let currentX = x
let direction = speed

function animateBall() {
  const { width: bodyWidth } = document.body.getBoundingClientRect()

  if (currentX + width >= bodyWidth) {
    direction = -speed
  } else if (currentX <= 0) {
    direction = speed
  }

  currentX += direction
  animatedBall.setAttribute('style', `transform: translate(${currentX}px)`)
}

function runAnimation() {
  cancelAnimationFrame(animationFrame)
  animationFrame = requestAnimationFrame(() => runAnimation())

  animateBall()
}

export { runAnimation }
