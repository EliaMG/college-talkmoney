
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
      barHeight = 22,
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
    .attr({"width": "70%", "height": "70%"})
    .attr("viewBox", "0 0 " + (width + 100) + " " + (height + 100) )
    .attr("preserveAspectRatio", "xMidYMid meet");
      // .attr("width", width)
      // .attr("height", height + data.length * data.length +10);

chart.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", function(d, i) {
        return (i * yScale.rangeBand());
      })
      .attr("height", yScale.rangeBand() - 3)
      .attr("width", 0)
      .attr("fill", function(d, i) {
        return "rgb(25, " + (100 + i * 30) + ", 35)";
      })
      // .attr("transform", function(d,i) {
      //     return "translate(" + [yScale(i), 0] + ")"
      // })
    // getscreenCTM help from: http://stackoverflow.com/questions/16256454/d3-js-position-tooltips-using-element-position-not-mouse-position
      .on("mouseover", function(d) {
      var matrix = this.getScreenCTM()
      .translate(+ this.getAttribute("x"), + this.getAttribute("y"))

      d3.select("#tooltip")
        .classed("hidden", false)
        .style("left", (window.pageXOffset + matrix.e + 30) + "px")
        .style("top", (window.pageYOffset + matrix.f - 30) + "px")
        .select("#value")
        .html("<strong>" + d.name + "</strong> <br/>" +
              "Net Price: $" + d.net_price);
    })
    .on("mouseout", function() {
      //Hide the tooltip
      d3.select("#tooltip").classed("hidden", true);
    })
      .transition()
        .delay(function(d, i) { return i * 100; })
      .duration(1000)
      .attr("width", function(d) {
        return xScale(d.net_price);
      });

  chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (height - 10) + ")")
    .call(xAxis);

  chart.append("text")      // text label for the x axis
    .attr("transform", "translate(" + (width / 2) + " ," + (height + 25) + ")")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Net Price");
  };

  var svg= d3.select(".cyl-chart")
    // .append("svg")
    .attr("width", 600)
    .attr("height", 600);

  var dataset = ["blue", "red", "green","purple"];

  var rects = d3.select(".cyl-chart").selectAll("rect")
    .data(dataset)
    .enter().append("rect")
    .style("fill",function(d) { return  d ; })
    .attr("y", 410)
    .attr("id", function(d,i){return "rect"+i;})
    .attr("x", function(d,i){ return (i+1)*100-40;})
    .attr("width", 80)
    .attr("height",1)
    .attr("stroke","black")
    .attr("stroke-width",3);

  var ellipses = d3.select(".cyl-chart").selectAll("ellipse")
    .data(dataset)
    .enter().append("ellipse")
    .style("fill",function(d) { return  d ; })
    .attr("cy", 410)
    .attr("cx", function(d,i){ return (i+1)*100;})
    .attr("rx", 40)
    .attr("ry", 30)
    .attr("stroke","black")
    .attr("stroke-width",3);   ;

  var rects2 = d3.select(".cyl-chart").selectAll("rect2")
    .data(dataset)
    .enter().append("rect")
    .style("fill",function(d) { return  d ; })
    .attr("y", 410)
    .attr("id", function(d,i){return "rect2"+i;})
    .attr("x", function(d,i){ return (i+1)*100-38;})
    .attr("width",76 )
    .attr("height",1);

  var ellipses2 = d3.select(".cyl-chart").selectAll("ellipse1")
    .data(dataset)
    .enter().append("ellipse")
    .style("fill",function(d) { return  d ; })
    .attr("cy", 410)
    .attr("cx", function(d,i){ return (i+1)*100;})
    .attr("rx", 40)
    .attr("ry", 30)
    .attr("class","ell")
    .attr("stroke","black")
    .attr("stroke-width",3);

  ellipses2.on("mouseover",function(d,i){ d3.select(this).transition().ease("elastic").duration(1000).attr("cy",(i+2)*75);
    d3.select("#rect"+i).transition().ease("elastic").duration(1000).attr("height",410-(i+2)*75).attr("y",(i+2)*75);
    d3.select("#rect2"+i).transition().ease("elastic").duration(1000).attr("height",410-(i+2)*75).attr("y",(i+2)*75);
    d3.select(this).transition().delay(1000+(i+1)*300).duration((i+1)*600).attr("cy",410);
    d3.select("#rect"+i).transition().delay(1000+(i+1)*300).duration((i+1)*600).attr("height",0).attr("y",410);
    d3.select("#rect2"+i).transition().delay(1000+(i+1)*300).duration((i+1)*600).attr("height",0).attr("y",410);
  });
});
// bar.append("text")
//   .attr("x", function(d) { return x(d.net_price) - 4; })
//   .attr("y", barHeight / 2)
//   .attr("dy", ".35em")
//   .text(function(d) { return d.name; });
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
// .transition()
// .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
