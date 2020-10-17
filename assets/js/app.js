// @TODO: YOUR CODE HERE!

// Create the SVG area
var svgWidth = 800;
var svgHeight = 600;

// Set margins for the visualizations area
var margin = {
  top: 40,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial params on page open
var chosenXAxis = "in_poverty"
var chosenYAxis =  "is_smoker"

// // function to update xaxis
// function xScale(censusData, chosenXAxis) {
//     // create scales
//     var xLinearScale = d3.scaleLinear()
//       .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
//         d3.max(censusData, d => d[chosenXAxis]) * 1.2
//       ])
//       .range([0, width]);
  
//     return xLinearScale;
  
//   }

// // function to update yscale
// function yScale(censusData, chosenYAxis) {
//     // create scales
//     var xLinearScale = d3.scaleLinear()
//       .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
//         d3.max(censusData, d => d[chosenXAxis]) * 1.2
//       ])
//       .range([0, width]);
  
//     return xLinearScale;
  
//   }

  // function used for updating xAxis var upon click on axis label
// function renderAxes(newXScale, xAxis) {
//     var bottomAxis = d3.axisBottom(newXScale);
  
//     xAxis.transition()
//       .duration(1000)
//       .call(bottomAxis);
  
//     return xAxis;
//   }

  // function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var Xlabel;

    if (chosenXAxis === "in_poverty") {
        Xlabel = "% In Poverty:";
    }
    // else if (chosenXAxis === "median_age") {
    //     Xlabel = "Age (Median)";
    // }
    // else {
    //     Xlabel = "Household Income (Median)";
    // }

    var Ylabel;

    if (chosenYAxis === "is_smoker") {
        Ylabel = "Smokes (%)";
    }
    // else if (chosenYAxis === "is_obese") {
    //     Ylabel = "Obese (%)";
    // }
    // else {
    //     Ylabel = "Lacks Healthcare (%)";
    // }

    // var toolTip = d3.tip()
    // .attr("class", "tooltip")
    // .offset([80, -60])
    // .html(d => `${d.censusData}<br>${Ylabel} ${d[chosenXAxis]}`);

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });

  return circlesGroup;
}
    



// READ IN DATA
d3.csv('./assets/data/data.csv').then(censusData => {
// console.log(data);
// console.log(data.columns);



// parse to numbers
censusData.forEach(data => {
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity; 
    data.smokes = +data.smokes; 
    data.poverty = +data.poverty; 
    data.age = +data.age;
    data.income = +data.income
    // console.log(data.obesity);
})
// console.log(censusData);
var yLinearScale = d3.scaleLinear()
    .domain([(d3.min(censusData, data => data.smokes)-2), d3.max(censusData, data => data.smokes)+2])
    .range([height, 0]);

var xLinearScale = d3.scaleLinear()
    .domain([d3.max(censusData, data => data.poverty)+2, d3.min(censusData, data => data.poverty)-2])
    .range([height, 0]);
    // console.log(d3.max(censusData, data => data.poverty));

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
 chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  chartGroup.selectAll("circle")
    .data(censusData)
    .join("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", 12)
    .attr("fill", "lightblue")
    .attr("opacity", 0.5)
    .attr("stroke", "black");

    svg.selectAll("text")
    .data(censusData)
    .join("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.smokes))
    .text(d => d.abbr)
    .attr("font-size", "10px")
    .attr("color", "black");
        


    // svg.selectAll("circle")
    // .transition()
    // .delay(function(d,i){return(i*3)})
    // .duration(2000)
    // .attr("cx", function (d) { return x(d.smokes); } )
    // .attr("cy", function (d) { return y(d.poverty); } )

    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

// append x axis options
   labelsGroup.append("text")
    .attr("x", 0 - (width / 8))
    .attr("y", 20)
    .attr("value", "is_smoker") // value to grab for event listener
    .classed("active", true)
    .text("Smokers (%)");

   labelsGroup.append("text")
    .attr("x", 0 - (width / 8))
    .attr("y", 40)
    .attr("value", "median_age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

   labelsGroup.append("text")
    .attr("x", 0 - (width / 8))
    .attr("y", 60)
    .attr("value", "median_income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // append y axes options
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "in_poverty")
    .attr("dy", "1em")
    .classed("active", true)
    .text("Poverty (%)");

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - (height / 2))
    .attr("value", "is_obese")
    .attr("dy", "1em")
    .classed("inactive", true)
    .text("Obese (%)");

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("value", "lacks_healthcare")
    .attr("dy", "1em")
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");


}).catch(error => console.log(error));

