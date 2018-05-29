var width = 800;
var height = 600;
var padding = 50;

var data = races;

var xScale = d3.scaleLinear()
               .domain([0, width])
               .range([padding, width - padding]);

var yScale = d3.scaleLinear()
               .domain(d3.extent(data, d => getPacePerMin(d)))
               .range([height - padding, padding]);

var xAxis = d3.axisBottom(xScale)
              .tickSize(- height + 2 * padding)
              .tickSizeOuter(0);

var yAxis = d3.axisLeft(yScale)
              .tickSize(- width + 2 * padding)
              .tickSizeOuter(0);

var fScale = d3.scaleLinear()
             .domain([0, 100])
             .range(["lightgreen", "darkred"]);

var svg = d3.select("#scatterplot")
                .attr("width", width)
                .attr("height", height);

svg.append("g")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

svg.append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

svg
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", (d , i) => xScale( width/(data.length - 1) * i))
    .attr("cy", d => yScale(getPacePerMin(d)))
    .attr("r", d => 10)
    .attr("fill",  d => fScale(d.placement / d.totalContender * 100))
    .attr("stroke", "#fff");

function getPacePerMin(data) {
    var raceTimeInSecs = +data.raceTime.hours * 60 * 60 +
                         +data.raceTime.min   * 60 +
                         +data.raceTime.sec;

    var pace = raceTimeInSecs / +data.distance;
    // pace = timeConv(pace);
    // console.log(pace);
    return pace;
}

function doubleDigit(num){
			if(num < 10){
			return "0"+num;
			}

			else{
				return num;
			}
};

function timeConv (time){
			var hour = 0;
			var min = 0;
			var sec = 0;

			if(time > 3600){
				hour = Math.floor(time/3600);
				min = Math.floor((time%3600)/60);
				sec = ((time%3600)%60) % 60;
			    return hour + ":" + doubleDigit(min) + ":" + doubleDigit(sec);
			}
			else if (time > 60){
				min = Math.floor(time/60);
				sec = (time%60) % 60;
				return doubleDigit(min) + ":" + doubleDigit(sec);
			}
			else {
				return time;
			}
};

var minYear = d3.min(data, d => d.date.year);
var maxYear = d3.max(data, d => d.date.year);

var svg = d3.select("#pie")
                .attr("width", 400)
                .attr("height", 400)
                .append('g')
                  .attr('transform', 'translate(' + 400 / 2 + ', ' + 400 / 2 + ')')
                .classed('chart', true);

drawPieChart(minYear);

d3.select('input')
    .property('min', minYear)
    .property('max', maxYear)
    .property('value', minYear)
    .on('input', () => drawPieChart(+d3.event.target.value));

function drawPieChart(year) {
    console.log(year)
    var tooltip = d3.select('body')
                    .append('div')
                        .classed('graph-tooltip', true);

    var colorRanges = {
      distance: ["lightgreen", "red"]
    };

    var scale = d3.scaleLinear()
                  .domain([7, 30])
                  .range(colorRanges["distance"]);

    var yearData = data.filter(d => d.date.year == year);

    var arcs = d3.pie()
                .sort((a, b) => a.date.month - b.date.month)
                .value(d => d.distance)
                (yearData);

    var path = d3.arc()
                 .innerRadius(0)
                 .outerRadius(400 / 2 - 40);

    var update = d3.select('.chart')
                    .selectAll('.arc')
                    .data(arcs);

    update
        .exit()
        .remove();

    update
        .enter()
        .append('path')
        .classed('arc', true)
        .attr("stroke", "#dff1ff")
        .attr("stroke-width", "0.25px")
        .merge(update)
        .on('mousemove', function (d) {
            tooltip
                .style('opacity', 1)
                .style("left", (d3.event.pageX - tooltip.node().offsetWidth / 2) + "px")
                .style("top", (d3.event.pageY - tooltip.node().offsetHeight - 10) + "px")
                .html(`
                    <p>${d.data.title}</p>
                    <p>Platz: ${d.data.placement}</p>
                    <p>${d.data.distance} km</p>
                    <p>${d.data.date.day}.${d.data.date.month}.${d.data.date.year}</p>
                `);
        })
        .on('mouseout', function () {
            tooltip
                .style('opacity', 0)
        })
        .transition()
            .attr('fill', d => scale(d.data.distance))
            .attr('stroke', 'black')
            .attr('d', path)

}

//   var outer = d3.select(".chart")
//                 .selectAll(".arc")
//                 .data(arcs);
//
//   outer
//     .enter()
//     .append("path")
//       .classed("arc", true)
//      .attr("fill", "#ff00ff")
//     .merge(outer)
//         .attr('stroke', 'black')
//       .attr("d", path);
// }


