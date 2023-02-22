
//###############################################################
// Adding Interaction  
// To enable interaction, we will still need event handlers
// and listeners. However, we will use d3 syntax instead of js. 
//###############################################################
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

const FRAME1 = d3.select("#vis1")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 



// This time, let's define a function that builds our plot
// function build_interactive_plot() {
function build_scatter_plot() {
  d3.csv("data/scatter-data.csv").then((data) => {
    
    const MAX_X1 = d3.max(data, (d) => { return parseInt(d.x); });
    const MAX_Y1 = d3.max(data, (d) => { return parseInt(d.y); });
    
    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const X_SCALE1 = d3.scaleLinear() 
                    .domain([1, (MAX_X1) + 1]) // add some padding  
                    .range([0, VIS_WIDTH]);  
    const Y_SCALE1 = d3.scaleLinear() 
                    .domain([1, (MAX_Y1 + 1)]) // add some padding  
                    .range([VIS_HEIGHT, 0]);  
    
    const X_SCALE2 = d3.scaleLinear() 
                    .domain([0, VIS_WIDTH]) // add some padding  
                    .range([1, (MAX_X1) + 1]); 

    const Y_SCALE2 = d3.scaleLinear()
                    .domain([VIS_HEIGHT, 0])
                    .range([1, (MAX_Y1 + 1)])


    // Use X_SCALE and Y_SCALE to plot our points
    FRAME1.selectAll("circle")  
        .data(data) // passed from .then  
        .enter()       
        .append("circle")
          .attr("cx", (d) => { return (X_SCALE1(d.x) + MARGINS.left); }) 
          .attr("cy",  (d) => { return (Y_SCALE1(d.y) + MARGINS.top); }) 
          .attr("r", 10)
          .attr("class", "point")
          .style("opacity", 0.8)
  
    // add hover functionality to circles for mouseover and mouseleave
    circles = FRAME1.selectAll("circle")
    circles
        .on("mouseover", function(){
          console.log("hover over");
          d3.select(this)
          .transition(300)
          .style("opacity", 2)
        })
        .on("mouseleave", function(){
          console.log("hover over");
          d3.select(this)
          .transition(300)
          .style("opacity", 0.7)
        })
        .on("click", function(){
          console.log("click");
          const x = d3.select(this)
          if (x.attr("stroke")==null || x.attr("stroke")=="none") {
            x.attr("stroke", "black")
            .attr("stroke-width", 4)
          }
          else {
            x.attr("stroke", "none")
          }
          const cx = d3.select(this).attr("cx");
          const cy = d3.select(this).attr("cy");
          cxx = Math.round(X_SCALE2(cx-MARGINS.left))
          cyy = Math.round(Y_SCALE2(cy-MARGINS.top))
          document.getElementById("coordinate-display").innerHTML= `Last point clicked<br> (${cxx}, ${cyy})`;
        })
      


      // create submit button for x and y coordinate input
      submit_button = d3.select("#submit-button");
      submit_button
        .on("click", function(){
        x = d3.select("#x-coordinate").property("value");
        y = d3.select("#y-coordinate").property("value");
        console.log(x);
        FRAME1
          .append("circle")
          .attr("cx", X_SCALE1(x) + MARGINS.left) 
          .attr("cy", Y_SCALE1(y) + MARGINS.top) 
          .attr("r", 10)
          .attr("class", "point");
        });

      submit_button.on("click", function() {
    // Get the x and y coordinates of the new point
    const x = d3.select("#x-coordinate").property("value");
    const y = d3.select("#y-coordinate").property("value");

    // Add the new point to the scatter plot
   FRAME1.append("circle")
      .attr("cx", X_SCALE1(x) + MARGINS.left) 
      .attr("cy", Y_SCALE1(y) + MARGINS.top) 
      .attr("r", 10)
      .attr("class", "point");

    // Update the circles variable by selecting all the circle elements again
    circles = FRAME1.selectAll("circle");

    // Add the mouseover, mouseleave, and click event listeners to the new circles
    circles
      .on("mouseover", function() {
        d3.select(this)
          .transition()
          .duration(300)
          .style("opacity", 1);
      })
      .on("mouseleave", function() {
        d3.select(this)
          .transition()
          .duration(300)
        . style("opacity", 0.7);
      })
      .on("click", function() {
        const x = d3.select(this);
        if (x.attr("stroke") == null || x.attr("stroke") == "none") {
          x.attr("stroke", "black")
            .attr("stroke-width", 4);
        } else {
          x.attr("stroke", "none");
        }
        const cx = d3.select(this).attr("cx");
        const cy = d3.select(this).attr("cy");
        const cxx = Math.round(X_SCALE2(cx - MARGINS.left));
        const cyy = Math.round(Y_SCALE2(cy - MARGINS.top));
        document.getElementById("coordinate-display").innerHTML = `Last point clicked<br> (${cxx}, ${cyy})`;
      });
});


    // Add an axis to the vis  
    FRAME1.append("g") 
    .attr("transform", "translate(" + MARGINS.left + 
    "," + (VIS_HEIGHT + MARGINS.top) + ")") 
    .call(d3.axisBottom(X_SCALE1).ticks(10)) 
    .attr("font-size", '20px'); 

    FRAME1.append("g") 
    .attr("transform", "translate(" + MARGINS.left + 
    "," + (MARGINS.top) + ")") 
    .call(d3.axisLeft(Y_SCALE1).ticks(10)) 
    .attr("font-size", '20px'); 
    });
}
// call scatter plot function 
build_scatter_plot();



const FRAME2 = d3.select("#vis2")
                  .append("svg")
                    .attr("height", 300)
                    .attr("width", 800)
                    .attr("class", "frame"); 


const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 500 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

function build_bar_plot() {
// Create the SVG element for the chart
const svg = d3.select("#vis2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the data from the CSV file
fetch("data/bar-data.csv")
  .then(response => response.text())
  .then(data => {
    data = d3.csvParse(data);
  
    // Define scales for the x and y axes
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, width])
      .padding(0.1);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.amount)])
      .range([height, 0]);
  
    // Create the bars
    const bars = FRAME2.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.category))
        .attr("y", d => yScale(d.amount))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.amount))
        .attr("fill", "steelblue");
  

  const tooltip = d3.select("#vis2")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  

  bars.on("mouseover", function(d) {
      tooltip.transition()
          .duration(200)
          .style("opacity", .9);
      tooltip.html(d.value)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      d3.select(this).style("fill", "orange");
  })
  .on("mouseout", function(d) {
      tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      d3.select(this).style("fill", "steelblue");
  });

  // Add an axis to the vis  
  FRAME2.append("g") 
  .attr("transform", "translate(" + MARGINS.left + 
  "," + (VIS_HEIGHT + MARGINS.top) + ")") 
  .call(d3.axisBottom(X_SCALE1).ticks(10)) 
  .attr("font-size", '20px'); 

  FRAME2.append("g") 
  .attr("transform", "translate(" + MARGINS.left + 
  "," + (MARGINS.top) + ")") 
  .call(d3.axisLeft(Y_SCALE1).ticks(10)) 
  .attr("font-size", '20px'); 
  });
  
}

build_bar_plot();