$(function() {

  $(".user-input").click(function(event) {
    event.preventDefault();
    var inc = $('input:radio[name=inc]:checked').val(),
        ids = $('input[name=school-ids]').val(),
        url = "schools/getschools?inc=" + inc + "&school-ids=" +ids;
    dataCall(event, url);
  });

  function dataCall(event, url) {
    event.preventDefault();
    $(".bar-chart").empty();
    $(".cyl-chart").empty();
    $.ajax(url, {
      type: "get",
      success: function (data) {
        makePriceChart(data, "price", "Average Net Price");
        $(".earn-switch").click(function(){
          $(".bar-chart").empty();
          makePriceChart(data, "earn", "Average Annual Earnings");
          $(".no-data").remove();
        });
        $(".loan-switch").click(function(){
          $(".bar-chart").empty();
          makePriceChart(data, "loan", "Average Loan Debt");
            $(".no-data").remove();
        });
        $(".price-switch").click(function(){
          $(".bar-chart").empty();
          makePriceChart(data, "price", "Average Net Price");
            $(".no-data").remove();
        });
        makeCylinderChart(data);
      }
    });
  };

  $(".start-over").click(function() {
    location.reload();
  });

  function makePriceChart(data, data_type, text_type) {
    if(data.length == 0) {
      $(".no-data").remove();
      $("#selected-schools")
      .append("<p class=no-data> Sorry, please click start over or add schools.</p>")
    } else {
      d3.select("#switch-buttons").classed("hidden-xs-up", false);
      $('html,body').animate({scrollTop: $("#switch-buttons").offset().top}, 'slow');
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
        .attr("viewBox", "0 0 " + (width + 100) + " " + (height + 30) )
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
          .classed("hidden-xs-up", false)
          .style("left", (window.pageXOffset + matrix.e + 30) + "px")
          .style("top", (window.pageYOffset + matrix.f - 30) + "px")
          .select("#value")
          .html("<strong>" + d.name + "</strong> <br/>" +
                text_type + ": $" + d[data_type].toLocaleString() +
                "<br/><em>" + d.control + "</em>");
        })
        .on("mouseout", function() {
          //Hide the tooltip
          d3.select("#tooltip").classed("hidden-xs-up", true);
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
        .attr("class", "chart-label")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .html(text_type);

      var sortOrder = false;

      var sortBars = function() {
        sortOrder = !sortOrder;

        chart.selectAll("rect")
        .sort(function(a, b) {
          if (sortOrder) {
            return a[data_type]- b[data_type];
          } else {
            return b[data_type]- a[data_type];
          }
        })
        .transition()
        .duration(750)
        .delay(function(d, i) { return i * 50; })
        .attr("y", function(d,i) {
          return i * yScale.rangeBand();
        });
      };

      $(".fa-sort").on("click", function() {
        sortBars();
      });

      $('.fa-sort').tooltip();
    }
  };

  function makeCylinderChart(data) {
    if(data.length == 0) {
      $(".cyl-chart").empty();
    } else {
      //makes the initial fill color the same as the background
      var decolor = d3.rgb(222, 220, 211),
          earncolor = d3.rgb("#4DBD33"),
          loancolor = d3.rgb("#2E6891");

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
        .attr("viewBox", "0 0 " + (width + 120) + " " + (height + 70) )
        .attr("preserveAspectRatio", "xMidYMid meet");

      var container = svg.append("g");

      var bars = container.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("class", "bars");

      bars.append("rect")
        .style("fill", decolor)
        .attr("id", function(d,i){return "rect"+i;})
        .attr("x", function(d,i){ return xScale(i);})
        .attr("y", 15)
        .attr("width", xScale.rangeBand())
        .attr("height", 140)
        .attr("stroke","black")
        .attr("stroke-width",1);

      bars.append("rect")
        .style("fill", earncolor)
        .attr("id", function(d,i){return "rectover"+i;})
        .attr("y", 155)
        .attr("x", function(d,i){ return xScale(i) +0.5;})
        .attr("width", xScale.rangeBand()-1)
        .attr("height", 0);

      bars.append("text")
        .text(0)
        .attr("text-anchor", "middle")
        .attr("id", function(d,i){return "dollar"+i;})
        .attr("x", function(d,i){ return +$("#rect" +i).attr("x") +10})
        .attr("y", 12.5)
        .attr("font-size", "7px")
        .classed("hidden-xs-up", true);

      bars.append("text")
        .text(function(d) {return d.name;})
        .attr("transform", function (d, i) {
          return "rotate(-90) translate(" + (-150) +", " + (+$("#rect" +i).attr("x") +15) + ")"
        })
        .attr("text-anchor", "start")
        .attr("font-size", "6px");

      svg.append("text")      // text label for the x axis
        .attr("transform", "translate(" + (10) + " ," + (0) + ")")
        .style("text-anchor", "start")
        .attr("id", "earnings-loans")
        .text('Average Annual Earnings - Average Loan Debt');

      var earnonly = svg.append("text")      // text label for the x axis
          .attr("transform", "translate(" + (10) + " ," + (0) + ")")
          .style("text-anchor", "start")
          .attr("id", "earnings")
          .classed("hidden-xs-up", true)
          .text('Average Annual Earnings');

      //bars start by going up and down when the chart loads
      setTimeout(function(){ allUp(); }, 800);
      setTimeout(function(){ allDown(); }, 2000);

      //makes bars go up and turn green in line with earnings
      var earnUp = function(d,i) {
        d3.select("#rectover"+i).transition().duration('800')
          .attr("height", function(d) { return yScale(d.earn); })
          .attr("y", function(d) { return 155 - yScale(d.earn); })
          .style("fill", earncolor);
      }

      var tweenUp = function(d,i) {
        d3.select("#dollar"+i).classed("hidden-xs-up", false)
        .transition()
        .duration('800')
        .tween("text", textTween(d.earn));
      }

      var tweenDown = function(d,i) {
        d3.select("#dollar"+i).transition()
        .duration('800')
        .tween("text", textTween(d.earn - d.loan));
      }

      var transitionEarn = function() {
        $("#earnings-loans").fadeOut(400);
        setTimeout(function(){
          earnonly.classed("hidden-xs-up", false);
          $("#earnings").fadeIn(400);
        }, 400);
      }

      var transitionLoan = function() {
        setTimeout(function(){
          earnonly.classed("hidden-xs-up", true);
          $("#earnings-loans").fadeIn(400);
        }, 400);
      }

      function textTween(newVal){
        return function() {
          var oldVal = +this.textContent.replace(/[\$,]/g, "");
          var dollar = "$";
          var interp = d3.interpolateRound(oldVal, newVal);
          return function(t) {
            this.textContent = dollar + interp(t).toLocaleString();
          };
        }
      }

      //bars go down and change to red (subtract loan amount)
      var loanDown = function(d,i) {
        d3.select("#rectover"+i).transition().duration('800')
          .attr("height", function(d) { return yScale(d.earn-d.loan); })
          .attr("y", function(d) { return 155 - yScale(d.earn-d.loan); })
          .style("fill", loancolor);
      }

      var allUp = function() {
        transitionEarn();
        bars.each(function(d,i) {
          earnUp(d, i);
          tweenUp(d, i);
        });
      }

      var allDown = function() {
        transitionLoan();
        bars.each(function(d,i) {
          loanDown(d, i);
          tweenDown(d, i);
        });
      }

      bars.on("mouseenter",function(d){
        var max_wide = $("#rect" + (data.length - 1)).offset().left;
        var matrix = this.getScreenCTM()
        .translate(+ this.getAttribute("x"), + this.getAttribute("y"))

        d3.select("#tooltip")
          .classed("hidden-xs-up", false)
          .style("left", (max_wide + 240/data.length + 30) + "px")
          .style("top", (window.pageYOffset + matrix.f + 50) + "px")
          .select("#value")
          .html("<strong>" + d.name + "</strong><br><br/>" +
                "Average Earnings: $" + d.earn.toLocaleString() +
                "- <br/> Average Loan: $" + d.loan.toLocaleString() +
                "<hr> <em>Difference:</em> $" + (d.earn - d.loan).toLocaleString());
      });

      bars.on("mouseleave",function(){
        d3.select("#tooltip").classed("hidden-xs-up", true);
      });

      container.on("mouseenter",function(){
        allUp();
      });

      container.on("mouseleave",function(){
        allDown();
      });

      container.on("mousedown",function(){
        allUp();
      });

      container.on("mouseup",function(){
        allDown();
      });
    }
  };
});
