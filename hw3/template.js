d3.csv("penguins.csv", function(d) {
  return {
    species: d.species,
    flipperLength: +d.flipper_length_mm,
    billLength: +d.bill_length_mm
  };
}).then(function(data) {
  createScatterPlot(data);
  createBoxplot(data);
});

function createScatterPlot(data) {
  const margin = { top: 10, right: 30, bottom: 40, left: 50 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

const x = d3.scaleLinear()
  .domain([d3.min(data, d => d.billLength) - 5, d3.max(data, d => d.billLength) + 5])
  .range([0, width]);

const y = d3.scaleLinear()
  .domain([d3.min(data, d => d.flipperLength) - 5, d3.max(data, d => d.flipperLength) + 5])
  .range([height, 0]);

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

svg.append("g")
  .call(d3.axisLeft(y));

svg.append("g")
  .selectAll("dot")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", d => x(d.billLength))
    .attr("cy", d => y(d.flipperLength))
    .attr("r", 5)
    .style("fill", "#69b3a2");

svg.append("text")
  .attr("text-anchor", "end")
  .attr("x", width/2 + margin.left)
  .attr("y", height + margin.top + 20)
  .text("Bill Length");

svg.append("text")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(-90)")
  .attr("y", -margin.left + 20)
  .attr("x", -margin.top - height/2 + 20)
  .text("Flipper Length");

}

function createBoxplot(data) {

  const margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  // SVG canvas setup
  const svgBoxplot = d3.select("#my_dataviz_boxplot")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Scales setup
  const xScaleBoxplot = d3.scaleBand()
    .range([0, width])
    .domain(data.map(d => d.species))
    .padding(0.2);

  svgBoxplot.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScaleBoxplot));

  const yScaleBoxplot = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.flipperLength)])
    .range([height, 0]);

  svgBoxplot.append("g")
    .call(d3.axisLeft(yScaleBoxplot));

  // Calculate the boxplot statistics
  const rollupFunction = flipperLengthArray => {
    flipperLengthArray.sort(d3.ascending);
    const q1 = d3.quantile(flipperLengthArray, .25);
    const median = d3.quantile(flipperLengthArray, .5);
    const q3 = d3.quantile(flipperLengthArray, .75);
    const iqr = q3 - q1;
    return {q1, median, q3, iqr};
  };

  const quartilesBySpecies = d3.rollup(data, v => rollupFunction(v.map(g => g.flipperLength)), d => d.species);

  quartilesBySpecies.forEach((quartiles, species) => {
    const x = xScaleBoxplot(species);
    const boxWidth = xScaleBoxplot.bandwidth();

    svgBoxplot.append("line")
  .attr("x1", x + boxWidth / 2)
  .attr("x2", x + boxWidth / 2)
  .attr("y1", yScaleBoxplot(quartiles.q1 - 1.5 * quartiles.iqr))
  .attr("y2", yScaleBoxplot(quartiles.q3 + 1.5 * quartiles.iqr))
  .attr("stroke", "black");

// Box
svgBoxplot.append("rect")
  .attr("x", x)
  .attr("y", yScaleBoxplot(quartiles.q3))
  .attr("width", boxWidth)
  .attr("height", yScaleBoxplot(quartiles.q1) - yScaleBoxplot(quartiles.q3))
  .attr("stroke", "black")
  .style("fill", "skyblue");

// Median line
svgBoxplot.append("line")
  .attr("x1", x)
  .attr("x2", x + boxWidth)
  .attr("y1", yScaleBoxplot(quartiles.median))
  .attr("y2", yScaleBoxplot(quartiles.median))
  .attr("stroke", "red");
  });
}
