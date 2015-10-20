$(function() {

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

  var width = 420,
      barHeight = 25,
      height = barHeight * (data.length + 2);

  var xScale = d3.scale.linear()
      .domain([ 0, data[data.length - 1].net_price ])
      .range([ 0, width]);

  var yScale = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeRoundBands([0, height], .1)

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(6);

  var chart = d3.select(".bar-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
    bar.append("rect")
      .attr("width", function(d) { return xScale(d.net_price); })
      .attr("height", barHeight - 1);
  // var bars = chart.selectAll("rect.bar")
  //   .data(data)
  //
  // bars.enter()
  //     .append("svg:rect")
  //     .attr("class", "bar")
  //
  // bars.exit()
  //   .transition()
  //   .duration(300)
  //   .ease("exp")
  //     .attr("width", 0)
  //     .remove()

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
      })
      // .transition()
      // .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
      var chart = d3.select(".bar-chart")

      chart.on("click", function(d) {
        d3.select("#tooltip")
          .classed("hidden", false)
          .style("left:", 200 + "px")
          .style("top:", 66 + "px")
          .select("#value")
          .text("HEYEYHEHSDFH:");
      });

      // chart.on("click", function(d) {
      //
      //   //  //Get this bar's x/y values, then augment for the tooltip
      //   //  var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
      //   //  var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;
      //   //
      //   //  //Update the tooltip position and value
      //   //
      //   //  //Show the tooltip
      //   //  d3.select("#tooltip").classed("hidden", false);
      //   //
      //   // })
      //   // .on("mouseout", function() {
      //   //
      //   //  //Hide the tooltip
      //   //  d3.select("#tooltip").classed("hidden", true);
      //     console.log("why");
      //     d3.select("#tooltip").classed("hidden", false);  })
      //   });


  // bar.append("text")
  //   .attr("x", function(d) { return x(d.net_price) - 4; })
  //   .attr("y", barHeight / 2)
  //   .attr("dy", ".35em")
  //   .text(function(d) { return d.name; });

  chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0,90)")
    .call(xAxis);

  chart.append("text")      // text label for the x axis
    .attr("transform", "translate(" + (width / 2) + " ," + (height) + ")")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Net Price");
  }
});
