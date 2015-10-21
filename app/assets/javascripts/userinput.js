$(function() {
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

var app = window.app = {};
app.Schools = function() {
  this._input = $('#school-search-txt');
  this._initAutocomplete();
};

// autocomplete prototype https://github.com/lugolabs/tutorials/tree/master/amazing
//h/t to http://stackoverflow.com/questions/2909077/autocomplete-disallow-free-text-entry

app.Schools.prototype = {
  _initAutocomplete: function() {
    this._input
      .autocomplete({
        source: 'schools/search',
        appendTo: '#school-search-results',
        select: $.proxy(this._select, this)
      })
      .autocomplete('instance')._renderItem = $.proxy(this._render, this);
  },
  _render: function(ul, item) {
  var markup = [
    '<span class="name">' + item.name + '</span>',
    '<span class="state">' + item.state + '</span>'
  ];
  return $('<li>')
    .append(markup.join(''))
    .appendTo(ul);
  },

  _select: function(e, ui) {
    this._input.val(ui.item.name);
    return false;
  }
};
