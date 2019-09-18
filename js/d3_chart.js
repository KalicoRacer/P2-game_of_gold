var svgWidth = 850;
var svgHeight = 500;
var svgRatio = svgWidth / svgHeight;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margin
var svg = d3.select("#multi_chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "athletes";
var chosenYAxis = "total_medals";

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
            d3.max(stateData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(stateData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
            d3.max(stateData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);
    return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}

// function used for moving State abbreviation labels along with circles
function renderCircleText(circlesText, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesText.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    return circlesText;

}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesText) {

    switch (chosenXAxis) {
        case "athletes":
            var xlabel = "Number of Athletes: ";
            var xformat = d3.format("");
            var xsuffix = "";
            break;
        case "population":
            var xlabel = "Population: ";
            var xformat = d3.format("");
            var xsuffix = "";
            break;
        case "gdp":
            var xlabel = "Per Capita GDP: ";
            var xformat = d3.format("$,");
            var xsuffix = "";
    }

    switch (chosenYAxis) {
        case "total_medals":
            var ylabel = "Total Medals: ";
            break;
        case "gold":
            var ylabel = "Gold Medals: ";
            break;
        case "obesity":
            var ylabel = "Obese: ";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${xlabel} ${xformat(d[chosenXAxis])}${xsuffix}<br>${ylabel} ${d[chosenYAxis]}%`);
        });

    circlesText.call(toolTip);

    circlesText.on("mouseover", function(data) {
        toolTip.show(data);
    })
    // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    return circlesText;
}

// Retrieve and parse data from the CSV file and execute everything below
d3.csv("data/stateData.csv").then(function(stateData) {
    stateData.forEach(function(data) {
        data.id = +data.id;
        data.state = data.state;
        data.abbr = data.abbr;
        data.athletes = +data.athletes;
        data.population = +data.population;
        data.gdp = +data.gdp;
        data.total_medals = +data.total_medals;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.gold = +data.gold;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(stateData, chosenXAxis);

    // Create y scale function
    var yLinearScale = yScale(stateData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("class", "stateCircle")
        .attr("opacity", ".75");

    // append initial circle text
    var circlesText = chartGroup.selectAll("circlesGroup")
        .data(stateData)
        .enter()
        .append("text")
        .text(function(data) {return data.abbr})
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("class", "stateText");

    // Create group for 2 x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var athletesLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "athletes") // value to grab for event listener
        .classed("active", true)
        .text("Number of Athletes");

    var populationLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "population") // value to grab for event listener
        .classed("inactive", true)
        .text("Population");

    var gdpLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "gdp") // value to grab for event listener
        .classed("inactive", true)
        .text("Per Capita GDP");

    // Create group for 2 y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0}, ${(height / 2) - 20})`);

    var total_medalsLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", 0)
        .attr("value", "total_medals") // value to grab for event listener
        .classed("active", true)
        .text("Total Medals Count");

    var goldLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", 0)
        .attr("value", "gold") // value to grab for event listener
        .classed("inactive", true)
        .text("Gold Medals");

    var obesityLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -70)
        .attr("x", 0)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obese (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(stateData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // updates circle text with new x values
            circlesText = renderCircleText(circlesText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes classes to change bold text
            switch (chosenXAxis) {
                case "athletes":
                    athletesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    populationLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    gdpLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    break;
                case "population":
                    athletesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    populationLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    gdpLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    break;
                case "gdp":
                    athletesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    populationLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    gdpLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

    yLabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

            // replaces chosenXAxis with value
            chosenYAxis = value;

            // functions here found above csv import
            // updates x scale for new data
            yLinearScale = yScale(stateData, chosenYAxis);

            // updates y axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

            // updates circles with new y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // updates circle text with new y values
            circlesText = renderCircleText(circlesText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes classes to change bold text
            switch (chosenYAxis) {
                case "total_medals":
                    total_medalsLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    goldLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    break;
                case "gold":
                    total_medalsLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    goldLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    break;
                case "obesity":
                    total_medalsLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    goldLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
});
