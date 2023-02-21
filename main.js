
//###############################################################
// Adding Interaction  
// To enable interaction, we will still need event handlers
// and listeners. However, we will use d3 syntax instead of js. 
//###############################################################
const FRAME_HEIGHT = 200;
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
function build_interactive_plot() {
  d3.csv("data/scatter-data.csv").then((data) => {
    
    const MAX_X1 = d3.max(data, (d) => { return parseInt(d.x); });
    const MAX_Y1 = d3.max(data, (d) => { return parseInt(d.y); });
    
    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const X_SCALE1 = d3.scaleLinear() 
                    .domain([0, (MAX_X1 + 5)]) // add some padding  
                    .range([0, VIS_WIDTH]);  
    const Y_SCALE1 = d3.scaleLinear() 
                    .domain([0, (MAX_Y1 + 10)]) // add some padding  
                    .range([0, VIS_HEIGHT]);  

    // Use X_SCALE and Y_SCALE to plot our points
    FRAME1.selectAll("circle")  
        .data(data) // passed from .then  
        .enter()       
        .append("circle")  
          .attr("cx", (d) => { return (X_SCALE1(d.x) + MARGINS.left); }) 
          .attr("cy",  (d) => { return (Y_SCALE1(d.y) + MARGINS.top); } ) 
          .attr("r", 10)
          .attr("class", "point");

    // Add an axis to the vis  
    FRAME1.append("g") 
    .attr("transform", "translate(" + MARGINS.left + 
    "," + (VIS_HEIGHT + MARGINS.top) + ")") 
    .call(d3.axisBottom(X_SCALE1).ticks(4)) 
    .attr("font-size", '20px'); 
    });

}

build_interactive_plot();

//////////////////////////////////////////////////////////////////////////////

const FRAME2 = d3.select("#vis2")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 


function build_bar_plot() {
  d3.csv("data/bar-data.csv").then((data) => {

    const MIN_Y2 = d3.min(data, (d) => { return parseInt(d.y); });
    const MAX_Y2 = d3.max(data, (d) => { return parseInt(d.y); });

    const X_SCALE2 = d3.scaleBand()
                    .domain([data.map(d => d.category)])
                    .rangeRound([MARGINS.left, FRAME_WIDTH - MARGINS.right])
                    .padding(0.1); // add some padding   
    
    const Y_SCALE2 = d3.scaleLinear() 
                    .domain([0, MAX_Y2])
                    .range(FRAME_HEIGHT-MARGINS.bottom, MARGINS.top); // add some padding  
  
    // plot our points
    FRAME2.selectAll("rect")  
        .data(data) // passed from .then  
        .enter()       
        .append("rect")  
          .attr("x", (d, i) => { return 50 + i * 50;}) 
          .attr("y",  (d) => { return FRAME_HEIGHT - d.amount; } ) 
          .attr("class", "bar")
          .attr("width", 40)
          .attr("height", (d) => { return d.amount; });
      
        // Add an axis to the vis  
    // FRAME2.append("g") 
    //     .attr("transform", "translate(" + MARGINS.left + 
    //     "," + (VIS_HEIGHT + MARGINS.top) + ")") 
    //     .call(d3.axisBottom(X_SCALE2))
    //     .call(d3.axisLeft(Y_SCALE2))
    //     .attr("font-size", '20px'); 

    FRAME2.append("g")
      .attr("transform", "translate(0,${FRAME_HEIGHT - MARGINS.bottom+ 100})")
      .call(d3.axisBottom(X_SCALE2).ticks(7));

    FRAME2.append("g")
      .attr("transform", "translate(${MARGINS.left} + 100,0)")
      .call(d3.axisLeft(Y_SCALE2).ticks(5));
      })
        
      }
build_bar_plot()


