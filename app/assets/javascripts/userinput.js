var app = window.app = {};
var counter = 0;
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
        source: function(request, response) {
          $.getJSON('schools/search', { term: request.term, years: $('input:radio[name=years]:checked').val() }, response);
        },
        appendTo: '#school-search-results',
        select: $.proxy(this._select, this),
        change: $.proxy(this._change, this)
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
  _change: function(event,ui) {
    if (ui.item==null) {
      $("#school-search-txt").val('');
      $("#school-search-txt").focus();
    }
  },

  _select: function(e, ui) {
    // $(ui.item.name).appendTo("#selected-schools").show();
    $(".no-data").remove();
    var school = $("<li></li>");
    school.text(ui.item.name);
    school.addClass("popper");
    school.data("id", ui.item.id);
    school.wrapInner('<a href="http://' + ui.item.url + '" target=_blank></a>');
    //implement to add deletability
    // crossout = $("<i class='fa fa-times'></i>");
    // school.prepend(crossout);

    $("#selected-schools").append(school);

    //adds a comma separated list of ids to the hidden input
    var results = $('#school-ids'),
        inputs = ui.item.id,
        stringAppend = results.val().length > 0 ? results.val() + "," : "";
        results .val( stringAppend + inputs );
  }
};
