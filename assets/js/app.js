// Define the radius of the state circles.  Then use that radius
// to calculate the font size we should use within those circles.
// This should be roughly 85% of the circle size.
const circleRadius = "10";
function getCircleFont(radius){
    var fontSize = +circleRadius * 0.85;
    var fontSizeChar = `${fontSize}px`;
    return fontSizeChar;
}

var circleFontSize = getCircleFont(circleRadius);

console.log(circleRadius);
console.log(circleFontSize);

// The makeResponsive function will do several things:
// 1. It reads in the data and generates our initial graph
// 2. It automatically detects the window size and fits the 
//    graph to that window.
// 3. It is run whenever the window is resized so that the 
//    graph will always be the right size for the window.
function makeResponsive() {
  
  // Select the div from the HTML file that holds the scatter plot.
  var scatterArea = d3.select("scatter") 

  // Test to see if there is anything already in the scatter plot.
  // If so, then remove it so we start with a clean slate.
  
  if (!scatterArea.empty()) {
    scatterArea.remove();
  }
  
  // Define SVG area dimensions as the height and width of the window.
  var svgHeight = window.innerHeight;
  var svgWidth = window.innerWidth;

  // Define the chart's margins as an object
  var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
  };

  // Define dimensions of the chart area
  var chartWidth = svgWidth - margin.left - margin.right;
  var chartHeight = svgHeight - margin.top - margin.bottom;

  // Now that we have an empty scatter area and know our dimensions,
  // we can append a div with class chart (from css).
  var chartHolder = scatterArea
    .append("div")
    .classed("chart",true)

  // Now add the svg element to the page. Set height and width 
  // according to svg dimensions and margins.
  var svgHolder = chartHolder.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Create a chart group area.  Use transformand translate determine axis placement.
  var chartGroup = svgHolder.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Load data from the csv file
  d3.csv("assets/data/data.csv").then(function(dataIn) {

    //if (error) throw error;

    // Cast key variables as a number using the unary + operator
    dataIn.forEach(function(data) {
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
    });

    // Create scales for key variables that will be x-axis variables. Go a little past the lowest
    // and highest value to allow for circle radius to be within the chart.
    var povertyLinearScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain([d3.min(dataIn, data => data.poverty)*0.85,d3.max(dataIn, data => data.poverty)*1.15]);

    var ageLinearScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain([d3.min(dataIn, data => data.age)*0.85,d3.max(dataIn, data => data.age)*1.15]);

    var incomeLinearScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain([d3.min(dataIn, data => data.income)*0.85,d3.max(dataIn, data => data.income)*1.15]);

    // Create scales for key variables that will be y-axis variables
    var healthcareLinearScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([d3.min(dataIn, data => data.healthcare)*0.85,d3.max(dataIn, data => data.healthcare)*1.15]);

    var smokeLinearScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([d3.min(dataIn, data => data.smokes)*0.85,d3.max(dataIn, data => data.smokes)*1.15]);

    var obesityLinearScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([d3.min(dataIn, data => data.obesity)*0.85,d3.max(dataIn, data => data.obesity)*1.15]);


    // create axes
    var povertyXAxis = d3.axisBottom(povertyLinearScale).ticks(10);
    var ageXAxis = d3.axisBottom(ageLinearScale).ticks(5);
    var incomeXAxis = d3.axisBottom(incomeLinearScale).ticks(5000);
    var healthcareYAxis = d3.axisLeft(healthcareLinearScale).ticks(5);
    var smokeYAxis = d3.axisLeft(smokeLinearScale).ticks(5);
    var obssityYAxis = d3.axisLeft(obesityLinearScale).ticks(1);

    // append axes
    chartGroup.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(povertyXAxis);

    chartGroup.append("g")
        .call(healthcareYAxis); 

    // append circles
    var makeCircles = chartGroup.selectAll("circle")
        .data(dataIn)
        .enter()
        .append("circle")
        .attr("cx", d => povertyLinearScale(d.poverty))
        .attr("cy", d => healthcareLinearScale(d.healthcare))
        .attr("r", circleRadius)
        .classed("stateCircle",true);
        
    // append text within the circles
    var makeCircleText = chartGroup.selectAll(".stateText")
        .data(dataIn)
        .enter()
        .append("text")
        .classed("stateText",true)
        .attr("x", d => povertyLinearScale(d.poverty))
        .attr("y", d => healthcareLinearScale(d.healthcare))
        .attr("dy",3)
        .attr("font-size",circleFontSize)
        .text(d => d.abbr);
    
  });

};

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
