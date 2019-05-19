
import PieHue from './pie-hue.js'

// let element = document.createElement('svg')
// element.setAttribute('id', 'plot')
// document.body.prepend(element)


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
plot.draw({ width: 600 , showLabels: false})
