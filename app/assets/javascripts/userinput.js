$(function() {
  // $('#tokenizeme').tokenfield({
  // autocomplete: {
  //   source: ['red','yellow','green','blue'],
  // },
  // showAutocompleteOnFocus: true
  // })
  $(".two-year").click(function(event) {
    var url = "/year?year=2";
    getData(event, url);
  });

  $(".four-year").click(function(event) {
    var url = "/year?year=4";
    getData(event, url);
  });

  function getData(event, url) {
    event.preventDefault();
    $.ajax(url, {
      type: "get",
      success: function (data) {
      tokenList(data);
    }
    });
  }

  function tokenList(data) {
    console.log(data);
  }
});
