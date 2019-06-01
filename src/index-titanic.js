
import PieHue from './pie-hue.js'
import pclass from './pclass.csv'


// drop header
let data = pclass.slice(1, pclass.length)

let labels = {
  "1": "Upper Class",
  "2": "Middle Class",
  "3": "Lower Class"
}

data = data.map(cols => ({
  category: labels[cols[0]],
  hue: Number(cols[1])
}))



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
    plot.draw({ width: 600 , showLabels: true})
}, 50)


