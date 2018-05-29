function render() {
    var data = professionalSkills;

    // reserve space for the axes and subtract that space
  // from the width and height properties so their values
  // accurately reflect the space available to the chart itself
  const margin = { top: 10, right: 10, bottom: 20, left: 70 }
  const width = 600 - margin.left - margin.right
  const height = 400 - margin.top - margin.bottom

  // create a scale to map scores to widths
  const xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width])

  // create a scale to calculate bar height
  const yScale = d3.scaleBand()
    .domain(data.map(function(d) { return d.name }))
    .range([0, height])

  // this is just a condensed version of render()
  // from the previous example at http://bit.ly/2t2RJ0S
  // the commented lines are the only substantive changes
  function render() {
    const bars = d3.select('#chart')
      .selectAll('div')
      .data(data, function(d) {
        return d.name
      })

    bars.enter()
      .append('div')
        .attr('class', 'bar')
        .style('width', 0)
        .style('height', function(d) {
          // use the height calculated by the band scale
          return yScale.bandwidth() - 2 + 'px'
        })
      .merge(bars)
        .transition()
      .delay((d, i) => i * 250)
      .duration(1000)
      .ease(d3.easeBounceOut)
        .style('width', function(d) {
          // pass the score through the linear scale function
          return xScale(d.percentage) + 'px'
        })
  }

  render()

  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .style('position', 'absolute')
    .style('top', 0)
    .style('left', 0)

  // create a group container and position it according to the margins
  // so subsequent commands are run from the correct coordinates
  const axisContainer = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  axisContainer.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))

  axisContainer.append('g')
    .call(d3.axisLeft(yScale))
}
