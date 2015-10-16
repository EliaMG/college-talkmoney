$(function() {
  init();
  $(".school-select").click(function(event) {
    var url = "/pricegraph";
    dataCall(event, url);
  });

  function dataCall(event, url) {
    event.preventDefault();
    $(".bar-chart").empty();
    $.ajax(url, {
      type: "get",
      success: function (data) {
      makeChart(data);
    }
    });
  }

  function makeChart(data) {

  var w = 420,
      barHeight = 22,
      h = 600;

  var xScale = d3.scale.linear()
      .domain([ 0, data[data.length - 1].net_price ])
      .range([ 0, w]);

  var yScale = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeRoundBands([0, h], .1)

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(6);

  var chart = d3.select(".bar-chart")
      // .attr("width", width)
      // .attr("height", height);
  var bars = chart.selectAll("rect.bar")
    .data(data)

  bars.enter()
      append("svg:rect")
      .attr("class", "bar")

  bars.exit()
    .transition()
    .duration(300)
    .ease("exp")
      .attr("width", 0)
      .remove()


  chart.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", function(d, i) {
        return yScale(i);
      })
      .attr("x", function(d) {
        return xScale(d.net_price);
      })

      .attr("height", yScale.rangeBand())
      .attr("width", function(d) {
        return xScale(d.net_price);
      });
      // .transition()
  //     .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
  // bar.append("rect")
  //     .attr("width", function(d) { return x(d.net_price); })
  //     .attr("height", barHeight - 1)
      // .on("mouseover", function(d) {
      //
      //    //Get this bar's x/y values, then augment for the tooltip
      //    var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
      //    var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;
      //
      //    //Update the tooltip position and value
      //    d3.select("#tooltip")
      //      .style("left", xPosition + "px")
      //      .style("top", yPosition + "px")
      //      .select("#value")
      //      .text(d);
      //
      //    //Show the tooltip
      //    d3.select("#tooltip").classed("hidden", false);
      //
      //   })
      //   .on("mouseout", function() {
      //
      //    //Hide the tooltip
      //    d3.select("#tooltip").classed("hidden", true);
      //
      //   });


  // bar.append("text")
  //   .attr("x", function(d) { return x(d.net_price) - 4; })
  //   .attr("y", barHeight / 2)
  //   .attr("dy", ".35em")
  //   .text(function(d) { return d.name; });

  chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0,80)")
    .call(xAxis);

  chart.append("text")      // text label for the x axis
    .attr("transform", "translate(" + (width / 2) + " ," + (height) + ")")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Net Price");
  }
});

function init()
{

    //setup the svg
    var svg = d3.select("#svg")
        .attr("width", w+100)
        .attr("height", h+100)
    svg.append("svg:rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("stroke", "#000")
        .attr("fill", "none")

    svg.append("svg:g")
        .attr("id", "barchart")
        .attr("transform", "translate(50,50)")

    //setup our ui
    d3.select("#data1")
        .on("click", function(d,i) {
            bars(data1)
        })
    d3.select("#data2")
        .on("click", function(d,i) {
            bars(data2)
        })
    d3.select("#random")
        .on("click", function(d,i) {
            num = document.getElementById("num").value
            bars(random(num))
        })


    //make the bars
    bars(data1)
}
