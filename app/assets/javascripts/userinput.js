$(function() {
  $(".year-select").click(function(event) {
    var url = "/year";
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
    $('input.tokenize').tokenfield({
    autocomplete: {
      source: data,
      delay: 100
    },
    showAutocompleteOnFocus: true
    });
  }
});
