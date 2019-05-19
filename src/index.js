
import PieHue from './pie-hue.js'

let data = []

for (let i=0; i<200; i++)
  data.push({ category: 'A', hue: 0 })

for (let i=0; i<600; i++)
  data.push({ category: 'A', hue: 1 })

for (let i=0; i<300; i++)
  data.push({ category: 'B', hue: 0 })

for (let i=0; i<10; i++)
  data.push({ category: 'B', hue: 1 })



let plot = new PieHue('plot', data)
let count = 0
let limit = 100
let interval = setInterval(() => {
    count++
    if (count === limit) {
        clearInterval(interval)
        return
    }
    plot.force()
    plot.draw({ width: 600 , showLabels: false})
}, 50)


