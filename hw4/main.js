
// Set the dimensions for the canvas
const margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// Set the ranges
const x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
const y = d3.scaleLinear()
          .range([height, 0]);
          
// Add the SVG element
const svg = d3.select("#plot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// Load the data from the CSV file
d3.csv("us_statewide_crime.csv", (data) => {
  // Format the data if necessary
  data.forEach((d) => {
    d.Unemployed = +d.Unemployed; // 
  });

  // Scale the range of the data in the domains
  x.domain(data.map((d) => d.state));
  y.domain([0, d3.max(data, (d) => d.Unemployed)]);

  // Create the bars
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.state))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.Unemployed))
      .attr("height", (d) => height - y(d.Unemployed))
      .attr("fill", "steelblue") // default color
      // Add click interaction
      .on("click", function(event, d) {
        // This toggles the class on click
        d3.select(this).classed("highlighted", !d3.select(this).classed("highlighted"));
        d3.select(this).attr("fill", d3.select(this).classed("highlighted") ? "orange" : "steelblue");
      });

  // Add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
});

