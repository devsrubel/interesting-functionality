 const aeGraphData = [
    {year: 0, lineprod: 84000000, production: 84000000},
    {year: 1, lineprod: 186000000, production: 186000000},
    {year: 2, lineprod: 229000000, production: 229000000},
    {year: 3, lineprod: 263000000, production: 263000000},
    {year: 4, lineprod: 452000000, production: 452000000}
];

var aePointLabels = ['', '+120%', '+23%', '+14%', '+71%'];

const aeGraphDiv = document.getElementById("ae-graph-div");
const aeFiaField = document.getElementById("ae-fia-input");
const aeGraphYears = ['Joined AE', 'Year 1', 'Year 2', 'Year 3', 'Year 4'];
const aeGraphMargin = {top: 60, right: 0, bottom: 60, left: 0};
const aeGraphHeight = 500;
const aeGraphWidth = document.getElementById("ae-graph-div").offsetWidth;
//const aeGraphVisibilityCheck = aeGraphDiv.checkVisibility({visibilityProperty: true,});
const aeGraphOpacityCheck = window.getComputedStyle(aeGraphDiv).getPropertyValue("opacity");
//const input = document.querySelector('input'); // get the input element

if (aeGraphOpacityCheck == 1) {
    aeCreateGraph(aePointLabels);
};

aeFiaField.addEventListener("keyup", function(event) {
    if ((event.target.value.length > 0) && (event.target.value.length <= 4) && (event.target.value > 0) && (event.target.value <= 999)) { //event.keyCode === 13 for ENTER
        aeGraphDiv.innerHTML = "";
        document.getElementById("ae-fia-field-error-msg").innerHTML = "";
        var aeGraphValYearOne = event.target.value * (1 + 1.2);
        var aeGraphValYearTwo = aeGraphValYearOne * (1 + 0.23);
        var aeGraphValYearThree = aeGraphValYearTwo * (1 + 0.14);
        var aeGraphValYearFour = aeGraphValYearThree * (1 + 0.71);
        aePointLabels = ["$" + Number(event.target.value) + "M", "$" + parseFloat(aeGraphValYearOne).toFixed(1) + "M", "$" + parseFloat(aeGraphValYearTwo).toFixed(1) + "M", "$" + parseFloat(aeGraphValYearThree).toFixed(1) + "M", "$" + parseFloat(aeGraphValYearFour).toFixed(1) + "M"];
        console.log(event.target.value + " : " + aePointLabels);
        aeCreateGraph(aePointLabels);
        aeResizeInput(aeFiaField);
    }
    else {
        event.target.value = "";
        aeResizeInput(aeFiaField);
        document.getElementById("ae-fia-field-error-msg").innerHTML = "<br>Please input a number between 0 and 999";
        console.log(event.target.value + " : " + "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ are you sure about that");
    }
});

/*
if (document.getElementById("ae-graph-module").checkVisibility({opacityProperty: true,}) == true) {
    aeCreateGraph(aePointLabels);
} */

// function for resizing width of FIA production input field relative to content
function aeResizeInput() {
    var aeGraphFieldDynamicWidth = event.target.value.length + 0.7;
    aeFiaField.style.width = aeGraphFieldDynamicWidth + "ch";
}

function aeCreateGraph(aePointLabels) {
    const svg = d3.select("#ae-graph-div")
        .append("svg")
            .attr("width", aeGraphWidth + aeGraphMargin.left + aeGraphMargin.right)
            .attr("height", aeGraphHeight + aeGraphMargin.top + aeGraphMargin.bottom)
        .append("g")
            .attr("transform", `translate(${aeGraphMargin.left},${aeGraphMargin.top})`);

    // graph x-axis
    const x = d3.scaleBand()
        .domain(aeGraphData.map(d => d.year))
        .rangeRound([aeGraphMargin.left, aeGraphWidth - aeGraphMargin.right])
        .padding(0.2);
    svg.append("g")
        .attr("transform", `translate(0,${aeGraphHeight - aeGraphMargin.bottom})`)
        .attr("class", "ae-graph-xaxis-labels")
        .call(d3.axisBottom(x)
            .tickValues(d3.ticks(...d3.extent(x.domain()), aeGraphWidth / 40).filter(v => x(v) !== undefined))
            .tickFormat(function(d, i) {return aeGraphYears[i]})
            .tickSizeOuter(0)
        );

    // graph y-axis1
    const y1 = d3.scaleLinear()
        .domain([0, d3.max(aeGraphData, d => d.production)])
        .rangeRound([aeGraphHeight - aeGraphMargin.bottom, aeGraphMargin.top]);
    
    svg.append("g")
        .attr("transform", `translate(${aeGraphMargin.left},0)`)
        .style("color", "#889c98")
        .call(d3.axisLeft(y1)
            .ticks(null, "s")
            .tickFormat("")
            .tickSizeInner(-aeGraphWidth))
        .call(g => g.select(".domain").remove())
        /*
        .call(g => g.append("text")
            .attr("x", -aeGraphMargin.left)
            .attr("y", 10)
            .attr("fill", "#889c98")
            .attr("text-anchor", "start")
            .text(aeGraphData.y1)) */
        ;

    // graph y-axis2
    const y2 = d3.scaleLinear()
        .domain([0, d3.max(aeGraphData, d => d.lineprod)])
        .rangeRound([aeGraphHeight - aeGraphMargin.bottom, aeGraphMargin.top]);
    /*
    svg.append("g")
        .attr("transform", `translate(${aeGraphWidth - margin.right},0)`)
        .attr("color", "red")
        .call(d3.axisRight(y2))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", margin.right)
            .attr("y", 10)
            .attr("fill", "red")
            .attr("text-anchor", "end")
            .text(aeGraphData.y2)
        ); */
    
    // graph main bars
    svg.append("g")
        .attr("fill", "#42738B")
        .attr("fill-opacity", 1)
    .selectAll("rect")
    .data(aeGraphData)
    .join("rect")
        .attr("class", "ae-graph-bar")
        .attr("x", d => x(d.year))
        .attr("width", x.bandwidth())
        .attr("height", d => 0) // always equal to 0, no bar at start
        .attr("y", d => y1(0));

    // adding RED svg stripes
    svg.append("g")
        .attr("fill", "#B35439")
        .selectAll("rect")
        .data(aeGraphData)
        .join("rect")
            .attr("class", "ae-bar-red-stripe")
            .attr("x", d => x(d.year))
            .attr("width", x.bandwidth())
            .attr("height", d => 0)
            .attr("y", d => y1(0));

    // adding GREEN svg stripes
    svg.append("g")
        .attr("fill", "#78981B")
        .selectAll("rect")
        .data(aeGraphData)
        .join("rect")
            .attr("class", "ae-bar-green-stripe")
            .attr("x", d => x(d.year))
            .attr("width", x.bandwidth())
            .attr("height", d => 0)
            .attr("y", d => y1(0));

    // adding line graph
    const aeGraphLine = d3.line()
        .x(d => x(d.year) + x.bandwidth() / 2)
        .y(d => y2(d.lineprod) - 20);
    svg.append("path")
        .attr("class", "ae-graph-line")
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-miterlimit", 1)
        .attr("stroke-width", 4)
        .attr("stroke-dasharray", 1500)
        .attr("stroke-dashoffset", 1500)
        .attr("animation", "dash 5s linear forwards")
        .transition()
            .duration(2000)
            .attr("stroke-dashoffset", 0)
        .attr("d", aeGraphLine(aeGraphData));

    // adding scatterplot over line
    svg.selectAll("ae-graph-squares")
        .data(aeGraphData)
        .enter()
        .append("rect")
        .attr("class", "ae-graph-squares")
        .attr("fill", "white")
        .attr("opacity", "0")
        .attr("stroke", "none")
        .attr("x", function(d) {return x(d.year) + x.bandwidth() / 2.2})
        .attr("y", function(d) {return y1(d.lineprod) - 30})
        .attr("width", 15)
        .attr("height", 15);

    // adding labels above scatterplot points
    svg.selectAll("ae-graph-point-labels")
        .data(aeGraphData)
        .enter()
        .append("text")
        .attr("class", "ae-graph-point-labels")
        .text(function(d,i) {return aePointLabels[i]})
        .attr("fill", "#ffffff")
        .attr("opacity", "0")
        .attr("x", function(d) {
                if (window.innerWidth <= 450) {
                    return (x(d.year) + x.bandwidth() / 2) - 45;
                }
                return (x(d.year) + x.bandwidth() / 2) - 90;
                }
            ) // last num is different on live site lol
        .attr("y", function(d) {return y1(d.lineprod) - 50});

    //animation for main bars
    svg.selectAll(".ae-graph-bar")
        .transition()
        .duration(800)
        .attr("x", d => x(d.year))
        .attr("y", d => y1(d.production))
        .attr("height", d => (aeGraphHeight - y1(d.production)) - 60) // SUBTRACT BOTTOM MARGIN
        //.delay((d,i) => {console.log(i); return i*100});

    //animation for red stripes
    svg.selectAll(".ae-bar-red-stripe")
        .transition()
        .duration(800)
        .attr("y", d => y1(d.production)-20)
        .attr("height", 55)
        //.delay((d,i) => {console.log(i); return i*100});

    //animation for green stripes
    svg.selectAll(".ae-bar-green-stripe")
        .transition()
        .duration(800)
        .attr("y", d => y1(d.production)-40)
        .attr("height", 55)
        //.delay((d,i) => {console.log(i); return i*100});

    //animation for scatterplot points
    svg.selectAll(".ae-graph-squares")
        .transition()
        .duration(800)
        .attr("opacity", "1")
        //.delay((d,i) => {console.log(i); return i*100});

    //animation for labels
    svg.selectAll(".ae-graph-point-labels")
        .transition()
        .duration(200)
        .attr("opacity", "1")
        //.delay((d,i) => {console.log(i); return i*50});
}