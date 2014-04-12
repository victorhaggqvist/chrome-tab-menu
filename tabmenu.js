$(function() {
  chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs){
    $.tablist = tabs;
    var tablist = $('#tabs');
    console.log(tabs);
    for (var i = 0; i < tabs.length; i++) {
      // tablist.append('<a href="#" class="list-group-item'+((tabs[i].selected)?" active":"")+'" data-id="'+tabs[i].id+'"><span class="pull-right close">&times;</span><img src="'+tabs[i].favIconUrl+'"><marquee onmouseout="this.stop()" onmouseover="this.start()">'+tabs[i].title+'</marquee></a>');
      tablist.append('<a href="#" class="list-group-item'+((tabs[i].selected)?" active":"")+'" data-id="'+tabs[i].id+'"><span class="pull-right close" data-close="'+tabs[i].id+'">&times;</span><img src="'+tabs[i].favIconUrl+'">'+tabs[i].title+'</a>');
    }
  });

  $('#tabs').bind('click', function(event) {
    event.preventDefault();
    if ($(event.target).attr('data-close') !== undefined) {
      console.log('closing');
      chrome.tabs.remove(parseInt($(event.target).attr('data-close')), function(){});
    } else {
    // console.log($(event.target).attr('data-id'));
    chrome.tabs.update(parseInt($(event.target).attr('data-id')),{highlighted: true},function(){});
    }
    return true;
  });

  // $('.close').bind('click',function(){
  //   console.log($(this));
  // });

  $('#filter').keyup(function(event) {
    console.log($(this).val());
    var lookup = [];

    var substrRegex = new RegExp($(this).val(), 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each($.tablist, function(i, tab) {
      if (substrRegex.test(tab.title)) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        lookup.push(tab);
      }
    });

    if (event.keyCode === 13){ //enter
      chrome.tabs.update(parseInt(lookup[0].id),{highlighted: true},function(){});
    }

    // for (var i = 0, len = $.tablist.length; i < len; i++) {
    //     if ($.tablist[i].title.indexOf($(this).val()) !== -1){
    //       console.log('owp '+$.tablist[i].title);
    //       lookup.push($.tablist[i]);
    //     }
    // }
    var tablist = $('#tabs');
    tablist.html('');
    for (var j = 0; j < lookup.length; j++) {
      tablist.append('<a href="#" class="list-group-item'+((lookup[j].selected)?" active":"")+'" data-id="'+lookup[j].id+'"><img src="'+lookup[j].favIconUrl+'">'+lookup[j].title+'</a>');
    }
    // var result = $.grep($.tablist, function(tabs){ return tabs.title == id; });/* Act on the event */
  });
});
