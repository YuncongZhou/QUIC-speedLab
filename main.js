const N = 10
const PATH = 'dummy'
const url = "https://10.4.0.1:54322"

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

const setNetwork = (rate, delay, loss) => {
  const body = {rate:rate, delay:delay, loss:loss}
  fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}

const resetNetwork = () => {
  setNetwork(-1,-1,-1)
}

const delay = (ms) =>{
  return new Promise( (resolve, reject) => {
      setTimeout(resolve, ms);
  });
}

const start = async () => {
  document.getElementById('start').disabled = true
  const data = []
  const flag = "QUIC"
  const rates = [10,100]
  const delays = [0,1,5,10,25,75,150,200]
  const losses = [0,0.1,0.5,1,4,10,15,20]
  for (let r of rates){
    for(let d of delays){
      for(let l of losses){
        setNetwork(r,d,l)
        await delay(100)
        const speeds = []
        for (let i = 0; i !== N; ++i) {
          const t1 = performance.now()
          const response = await fetch(PATH)
          const blob = await response.blob()
          const t2 = performance.now()
          const speed = 8* blob.size /  (t2 - t1)
          speeds.push(speed)
          setValue('current', i + 1)
          setValue('mean', mean(speeds))
          setValue('sem', sem(speeds))
        }
        resetNetwork();
        data.push([flag,r,d,l,mean(speeds),sem(speeds)])
      }
    }
  }

  // setNetwork(100,0,0)
  let csvContent = "data:text/csv;charset=utf-8,";
  data.forEach(function(rowArray){
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  });
  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
  document.getElementById('reset').disabled = false
}

const init = () => {
  console.log(`connected to ${url}`)
  resetNetwork()
  setValue('total', N)
  document.getElementById('start').addEventListener('click', start)
  document.getElementById('reset').addEventListener('click', reset)
  reset()
}

init()
