import * as d3 from 'd3'

import arrayShuffle from 'array-shuffle'
import './pie-hue.css'

class PieHue {

    constructor (id, data) {

        this.id = '#' + id
        this.rad = 0.017
        this.gap = 0.03
        this.inner = 0.6
        this.outer = 1.0

        this.data = arrayShuffle(data)
        this.categories = this.createCategories(this.gap, this.data)
        this.placement(this.data, this.categories)

    }

    createCategories (gap, data) {
        let categories = data.reduce((acc, d) => {
            let c = String(d.category)
            if (c in acc) acc[c].count += 1
            else acc[c] = { count: 1 }
            return acc
        }, {})

        let array = Object.entries(categories)
        let total = array.reduce((acc, entry) => {
            return acc + entry[1].count
        }, 0)

        let theta0 = 0
        for (let cat in categories) {
            let p = (categories[cat].count / total)
            categories[cat].t0 = theta0
            categories[cat].t1 = theta0 + 2*Math.PI*(p-gap)

            theta0 = theta0 + 2*Math.PI*(p)
        }

        return categories
    }

    place (t0, t1) {
        let r0 = this.inner
        let r1 = this.outer - this.rad
        let rr = d3.randomUniform(0, 1)()
        let pr = Math.sqrt(rr*(r1*r1-r0*r0) + r0*r0)
        let tgap = this.rad/pr
        let theta =  d3.randomUniform(t0+tgap, t1-tgap)()
        let x = 1 + pr * Math.cos(theta)
        let y = 1 + pr * Math.sin(theta)
        return { x, y }
    }

    placement (data, categories) {

        let max_place = data.length
        let num_place = 0
        let rc = this.rad*1.5
        for (let i=0; i<data.length; i++) {

            let cat = String(data[i].category)
            let t0 = categories[cat].t0
            let t1 = categories[cat].t1

            let min = 0
            let p = this.place(t0, t1)

            while (min < rc && num_place < max_place) {

                min = 2*rc
                for (let j=0; j<i; j++) {
                    let dx = p.x - data[j].x
                    let dy = p.y - data[j].y
                    let dr = Math.sqrt(dx*dx + dy*dy)
                    min = Math.min(min, dr)
                }

                if (min < rc) {
                    p = this.place(t0, t1)
                    num_place += 1
                }

            }

            data[i].x = p.x
            data[i].y = p.y
        }
    }


    force () {

        let data = this.data
        let categories = this.categories
        let fx = []
        let fy = []
        let rc = 3*this.rad
        let aij = 0.01

        let r0 = this.inner
        let r1 = this.outer - this.rad

        for (let i=0; i<data.length; i++) {
            fx[i] = 0
            fy[i] = 0
        }

        for (let i=0; i<data.length; i++) {
            for (let j=i+1; j<data.length; j++) {

                let rx = data[i].x - data[j].x
                let ry = data[i].y - data[j].y
                let rr = Math.sqrt(rx*rx + ry*ry)

                if (rr < rc) {
                    let ff = aij*(1 - rr/rc)
                    let ffx = ff*rx/rr
                    let ffy = ff*ry/rr
                    fx[i] += ffx
                    fy[i] += ffy
                    fx[j] -= ffx
                    fy[j] -= ffy
                }
            }
        }

        for (let i=0; i<data.length; i++) {
            let x = data[i].x + fx[i]
            let y = data[i].y + fy[i]
            let dx = x - 1
            let dy = y - 1
            let tt = Math.atan2(dy,dx)
            if (tt < 0) { tt += 2*Math.PI }
            let cat = data[i].category
            let t0 = categories[cat].t0
            let t1 = categories[cat].t1
            let rr = Math.sqrt(dx*dx + dy*dy)
            let tgap = this.rad/rr
            if (rr < r1 && rr > r0 && tt > t0+tgap && tt < t1-tgap) {
                data[i].x = x
                data[i].y = y
            }
        }

    }

    draw ({ width, showLabels = true }) {

        let R = 0.5 * width
        let cx = R
        let cy = R

        let rr = this.rad * R
        let innerRadius = this.inner * R

        d3.select(this.id).attr('width', width).attr('height', width)

        d3.select(this.id).selectAll('circle').data(this.data).enter()
            .append('circle')
            .attr('cx', d => d.x * R )
            .attr('cy', d => d.y * R )
            .attr('r', rr)
            .attr('class', d => 'hue-' + String(d.hue))

        d3.select(this.id).selectAll('circle').data(this.data)
            .transition().duration(50)
            .attr('cx', d => d.x * R )
            .attr('cy', d => d.y * R )

        if (showLabels) {
            let drawArc = d3.arc()
                .innerRadius(innerRadius*0.3)
                .outerRadius(innerRadius)
                .startAngle(d => d[1].t0 + 0.5*Math.PI)
                .endAngle(d => d[1].t1 + 0.5*Math.PI)

            let arcs = Object.entries(this.categories)

            // add labels
            d3.select(this.id).selectAll('text.label').data(arcs).enter()
                .append('text')
                .attr('class', 'label')
                .each(function (d) {
                    let centroid = drawArc.centroid(d)
                    d3.select(this)
                        .attr('x', centroid[0] + cx)
                        .attr('y', centroid[1] + cy)
                        .attr('dy', '0.33em')
                        .text(d[0])
                })
                .attr('text-anchor', 'middle')
        }

    }

}

export default PieHue