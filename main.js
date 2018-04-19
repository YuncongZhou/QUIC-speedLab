const N = 10
const PATH = 'dummy'

const sum = arr => arr.reduce((acc, cur) => acc + cur, 0)
const mean = arr => sum(arr) / arr.length
const sem = arr => {
  const average = mean(arr)
  return Math.sqrt(arr.reduce((acc, cur) => acc + Math.pow(cur - average, 2))) / arr.length
}

const setValue = (id, value) => document.getElementById(id).textContent = value !== null ? value.toLocaleString() : '?'

const reset = () => {
  document.getElementById('reset').disabled = true
  setValue('current', null)
  setValue('mean', null)
  setValue('sem', null)
  document.getElementById('start').disabled = false
}

const start = async () => {
  document.getElementById('start').disabled = true
  const speeds = []
  for (let i = 0; i !== N; ++i) {
    const t1 = performance.now()
    const response = await fetch(PATH)
    const blob = await response.blob()
    const t2 = performance.now()
    const speed = blob.size / (125 * (t2 - t1))
    speeds.push(speed)
    setValue('current', i + 1)
    setValue('mean', mean(speeds))
    setValue('sem', sem(speeds))
  }
  document.getElementById('reset').disabled = false
}

const init = () => {
  setValue('total', N)
  document.getElementById('start').addEventListener('click', start)
  document.getElementById('reset').addEventListener('click', reset)
  reset()
}

init()
