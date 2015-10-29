$(function() {

  $(".user-input").click(function(event) {
    event.preventDefault();
    var inc = $(this).siblings('input:radio[name=inc]:checked').val(),
        ids = $(this).siblings('input[name=school-ids]').val(),
        url = "schools/getschools?inc=" + inc + "&school-ids=" +ids;
    dataCall(event, url);
  });

  $(".start-over").click(function() {
    location.reload();
  });

  function dataCall(event, url) {
    event.preventDefault();
    $(".bar-chart").empty();
    $(".cyl-chart").empty();
    $.ajax(url, {
      type: "get",
      success: function (data) {
        makePriceChart(data, "price", "Average Net Price");
        d3.select("#switch-buttons").classed("hidden", false);
        $(".earn-switch").click(function(){
          $(".bar-chart").empty();
          makePriceChart(data, "earn", "Average Annual Earnings")
        });
        $(".loan-switch").click(function(){
          $(".bar-chart").empty();
          makePriceChart(data, "loan", "Average Loan Debt")
        });
        $(".price-switch").click(function(){
          $(".bar-chart").empty();
          makePriceChart(data, "price", "Average Net Price")
        });
        makeCylinderChart(data);
      }
    });
  };

  function makePriceChart(data, data_type, text_type) {
    if(data.length == 0) {
      $("#sorry-data").remove();
      $("#selected-schools")
      .append("<p id=sorry-data> Sorry, please click start over or add schools.</p>")
    } else {
      var width = 420,
          barHeight = 22,
          height = barHeight * (data.length + 2);

      var max = d3.max(data, function(d) { return d[data_type]; });
      var xScale = d3.scale.linear()
          .domain([0, max])
          .range([0, width]);

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
          if (data_type == "price") {
            return "rgb(15, 25, " + (65 + i * 30) + ")";
          } else if (data_type == "loan") {
            return "rgb(" + (100 + i * 30) + ", 5, 5)";
          } else {
            return "rgb(25, " + (100 + i * 30) + ", 35)";
          }
        })
        .attr("class", function() {
          if (data_type == "price") {
            return "price-bar";
          } else if (data_type == "loan") {
            return "loan-bar";
          } else {
            return "earn-bar";
          }
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
                text_type + ": $" + d[data_type].toLocaleString() +
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
          return xScale(d[data_type]);
        });

      var axis = chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, " + (height - 25) + ")")
        .call(xAxis);

      axis.append("text")      // text label for the x axis
        .attr("transform", "translate(" + (width / 2) + " ," + (35) + ")")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(text_type);
    }
  };

  function makeCylinderChart(data) {
    if(data.length == 0) {
      $(".cyl-chart").empty();
    } else {
      //makes the initial fill color the same as the background
      var decolor = d3.rgb(222, 220, 211),
          earncolor = d3.rgb("#4DBD33"),
          loancolor = d3.rgb("#FF3333");

      var height = 150,
          rectWidth = 30,
          width = rectWidth * (data.length +1);

      var xScale = d3.scale.ordinal()
          .domain(d3.range(data.length))
          .rangeRoundBands([0, width], 0.28);

      var max = d3.max(data, function(d) { return d.earn; });

      var yScale = d3.scale.linear()
          .domain([0, max])
          .range([0, height-10]);

      var svg= d3.select(".cyl-chart")
        .attr({"width": "80%", "height": "80%"})
        .attr("viewBox", "0 0 " + (width + 120) + " " + (height + 50) )
        .attr("preserveAspectRatio", "xMidYMid meet");

      // var svgLocation = $(".cyl-chart").offset().top;

      var bars = svg.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("class", "bars");

      var rects = bars.append("rect")
        .style("fill", decolor)
        .attr("id", function(d,i){return "rect"+i;})
        .attr("x", function(d,i){ return xScale(i);})
        .attr("y", 10)
        .attr("width", xScale.rangeBand())
        .attr("height", 140)
        .attr("stroke","black")
        .attr("stroke-width",1);

      var dollars = bars.append("text")
        .text(0)
        .attr("text-anchor", "middle")
        .attr("id", function(d,i){return "dollar"+i;})
        .attr("x", function(d,i){ return +$("#rect" +i).attr("x") +10})
        .attr("y", 7.5)
        .attr("font-size", "7px")
        .classed("hidden", true);

      svg.append("text")      // text label for the x axis
        .attr("transform", "translate(" + (10) + " ," + (height + 15) + ")")
        .style("text-anchor", "start")
        .attr("id", "earnings-loans")
        .html("Average Annual Earnings - Average Loan Debt");

      var rectover = bars.append("rect")
        .style("fill", earncolor)
        .attr("id", function(d,i){return "rectover"+i;})
        .attr("y", 150)
        .attr("x", function(d,i){ return xScale(i) +0.5;})
        .attr("width", xScale.rangeBand()-1)
        .attr("height", 0);

      //makes bars go up and turn green in line with earnings
      var earnUp = function(d,i) {
        d3.select("#rectover"+i).transition().duration('800')
          .attr("height", function(d) { return yScale(d.earn); })
          .attr("y", function(d) { return 150 - yScale(d.earn); })
          .style("fill", earncolor);
      }

      var tweenUp = function(d,i) {
        d3.select("#dollar"+i).classed("hidden", false)
        .transition()
        .duration('800')
        .tween("text", textTween(d.earn));
      }

      var tweenDown = function(d,i) {
        d3.select("#dollar"+i).transition()
        .duration('800')
        .tween("text", textTween(d.earn - d.loan));
      }

      function textTween(newVal){
        return function() {
          var oldVal = 0;
          var dollar = "$";
          var interp = d3.interpolateRound(oldVal, newVal);
          return function(t) { this.textContent = dollar + interp(t).toLocaleString(); };
        }
      }

      //bars go down and change to red (subtract loan amount)
      var loanDown = function(d,i) {
        d3.select("#rectover"+i).transition().duration('800')
          .attr("height", function(d) { return yScale(d.earn-d.loan); })
          .attr("y", function(d) { return 150 - yScale(d.earn-d.loan); })
          .style("fill", loancolor);
      }

      bars.on("mouseenter",function(d,i){
        earnUp(d, i);
        tweenUp(d, i);
        var max_wide = $("#rect" + (data.length - 1)).offset().left;
        var matrix = this.getScreenCTM()
        .translate(+ this.getAttribute("x"), + this.getAttribute("y"))

        d3.select("#tooltip")
          .classed("hidden", false)
          .style("left", (max_wide + 100) + "px")
          .style("top", (window.pageYOffset + matrix.f) + "px")
          .select("#value")
          .html("<strong>" + d.name + "</strong> <br/>" +
                "Average Earnings: $" + d.earn.toLocaleString() +
                "<br/> Average Loan: $" + d.loan.toLocaleString());
      });

      bars.on("mouseleave",function(d,i){
        loanDown(d, i);
        tweenDown(d, i);
        d3.select("#tooltip").classed("hidden", true);
      });

      bars.on("mousedown",function(d,i){
        earnUp(d, i);
        tweenUp(d, i);
      });

      bars.on("mouseup",function(d,i){
        loanDown(d, i);
        tweenDown(d, i);
      });
    }
  };
});
