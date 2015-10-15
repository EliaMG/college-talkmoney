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
      barHeight = 20,
      height = barHeight * (data.length + 1);

  var x = d3.scale.linear()
      .domain([ 0, data[data.length - 1].net_price ])
      .range([ 0, width]);

  var y = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeBands([0, height], .2)

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var chart = d3.select(".bar-chart")
      .attr("width", width)
      .attr("height", height);

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
  bar.append("rect")
      .attr("width", function(d) { return x(d.net_price); })
      .attr("height", barHeight - 1);


  bar.append("text")
      .attr("x", function(d) { return x(d.net_price) - 4; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });

  chart.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,80)")
      .call(xAxis);
  }
});
