
$(function() {

  $(".user-input").click(function(event) {
    event.preventDefault();
    var inc = $(this).siblings('input:radio[name=inc]:checked').val(),
        ids = $(this).siblings('input[name=school-ids]').val(),
        url_params = "?inc=" + inc + "&school-ids=" +ids,
        price_url = "schools/pricegraph" + url_params,
        earn_url = "schools/cylinders" + url_params;
    // priceCall(event, price_url);
    earnCall(event, earn_url);
  });

  $(".start-over").click(function() {
    location.reload();
  });

  function priceCall(event, url) {
    event.preventDefault();
    $(".bar-chart").empty();
    $.ajax(url, {
      type: "get",
      success: function (data) {
        makeBarChart(data);
      }
    });
  };

  function earnCall(event, url) {
    event.preventDefault();
    $(".cyl-chart").empty();
    $.ajax(url, {
      type: "get",
      success: function (data) {
        makeCylinderChart(data);
      }
    });
  };

  function makeBarChart(data) {

    var width = 420,
        barHeight = 22,
        height = barHeight * (data.length + 2);

    var xScale = d3.scale.linear()
        .domain([ 0, data[data.length - 1].net_price ])
        .range([ 0, width]);

    var yScale = d3.scale.ordinal()
          .domain(d3.range(data.length))
          .rangeRoundBands([0, height-10], .1)

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(6);

    var chart = d3.select(".bar-chart")
      .attr({"width": "70%", "height": "70%"})
      .attr("viewBox", "0 0 " + (width + 100) + " " + (height + 50) )
      .attr("preserveAspectRatio", "xMidYMid meet");

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
      // getscreenCTM tooltip placement help from: http://stackoverflow.com/questions/16256454/d3-js-position-tooltips-using-element-position-not-mouse-position
      //toLocaleString returns the number with commas
      .on("mouseover", function(d) {
      var matrix = this.getScreenCTM()
      .translate(+ this.getAttribute("x"), + this.getAttribute("y"))

      d3.select("#tooltip")
        .classed("hidden", false)
        .style("left", (window.pageXOffset + matrix.e + 30) + "px")
        .style("top", (window.pageYOffset + matrix.f - 30) + "px")
        .select("#value")
        .html("<strong>" + d.name + "</strong> <br/>" +
              "Average Net Price: $" + d.net_price.toLocaleString() +
              "<br/><em>" + d.control + "</em>");
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
      .text("Average Net Price");
  };

  function makeCylinderChart(data) {
    //makes the initial fill color the same as the background
    var decolor = d3.rgb(222, 220, 211),
        earncolor = d3.rgb("#4DBD33"),
        loancolor = d3.rgb("#FF3333");

    var height = 150,
        rectWidth = 22,
        width = rectWidth * (data.length);

    var xScale = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeRoundBands([0, width], 0.25);

    var max = d3.max(data, function(d) { return d.earn; });

    var yScale = d3.scale.linear()
        .domain([0, max])
        .range([0, height-10]);


    var svg= d3.select(".cyl-chart")

      .attr({"width": "80%", "height": "80%"})
      .attr("viewBox", "0 0 " + (width + 50) + " " + (height + 50) )
      .attr("preserveAspectRatio", "xMidYMid meet");

    var svgLocation = $(".cyl-chart").offset().top;

    var rects = d3.select(".cyl-chart").selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .style("fill", decolor)
      .attr("id", function(d,i){return "rect"+i;})
      .attr("x", function(d,i){ return xScale(i);})
      .attr("y", 10)
      .attr("width", xScale.rangeBand())
      .attr("height", 140)
      .attr("stroke","black")
      .attr("stroke-width",1);

    // var ellipses = d3.select(".cyl-chart").selectAll("ellipse")
    //   .data(data)
    //   .enter().append("ellipse")
    //   .style("fill", decolor)
    //   .attr("cy", 400)
    //   .attr("cx", function(d,i){ return (i+1)*100;})
    //   .attr("class", "cylly")
    //   .attr("rx", 40)
    //   .attr("ry", 30)
    //   .attr("stroke","black")
    //   .attr("stroke-width",2.5);   ;

    var rectover = d3.select(".cyl-chart").selectAll("rectover")
      .data(data)
      .enter().append("rect")
      .style("fill", earncolor)
      .attr("id", function(d,i){return "rectover"+i;})
      .attr("y", 150)
      // .attr("y", function(d, i) {return ("rect"+i).attr("y") + ("rect"+i).attr("height")})
      .attr("x", function(d,i){ return xScale(i) +0.5;})
      .attr("width", xScale.rangeBand()-1)
      .attr("height", 0);
    //
    // var ellipses2 = d3.select(".cyl-chart").selectAll("ellipse1")
    //   .data(data)
    //   .enter().append("ellipse")
    //   .style("fill", decolor)
    //   .attr("class", "cylly")
    //   .attr("cy", 150)
    //   .attr("cx", function(d,i){ return (i+1)*100;})
    //   .attr("rx", 40)
    //   .attr("ry", 30)
    //   .attr("class","ell")
    //   .attr("stroke","black")
    //   .attr("stroke-width",2.5);

    rects.on("mouseover",function(d,i){
        // console.log(data);

      d3.select("#rectover"+i).transition().duration('800')
        .attr("height", function(d) { return yScale(d.earn); })
        .attr("y", function(d) { return 150 - yScale(d.earn); })
        .style("fill", earncolor);;

      d3.select("#rectover"+i).transition().duration('800').delay('1100')
        .attr("height", function(d) { return yScale(d.earn-d.loan); })
        .attr("y", function(d) { return 150 - yScale(d.earn-d.loan); })
        .style("fill", loancolor);

      // d3.select("#rect2" +i).transition().duration('200').style("fill","yellow");
      // d3.select("#ellipse" +i).transition().duration('200').style("fill","yellow");
      // d3.select("#rect2"+i).transition().ease("elastic").duration(1000).attr("height",410-(i+2)*75).attr("y",(i+2)*75);
    //   d3.select(this).transition().delay(1000+(i+1)*300).duration((i+1)*600).attr("cy",410);
    //   d3.select("#rect"+i).transition().delay(1000+(i+1)*300).duration((i+1)*600).attr("height",0).attr("y",410);
    //   d3.select("#rect2"+i).transition().delay(1000+(i+1)*300).duration((i+1)*600).attr("height",0).attr("y",410);
    });
  };
});
