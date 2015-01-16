(function () {
  var tablist = document.querySelector('#tabs');
  var _tabs;
  var filterBox = document.querySelector('#filter');
  var _filter;

  chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs){
    _tabs = tabs;
    console.log(tabs);
    for (var i = 0; i < tabs.length; i++) {
      // tablist.append('<a href="#" class="list-group-item'+((tabs[i].selected)?" active":"")+'" data-id="'+tabs[i].id+'"><span class="pull-right close">&times;</span><img src="'+tabs[i].favIconUrl+'"><marquee onmouseout="this.stop()" onmouseover="this.start()">'+tabs[i].title+'</marquee></a>');
      tablist.innerHTML = tablist.innerHTML+_renderItem(tabs[i].selected, tabs[i].id, tabs[i].favIconUrl, tabs[i].title);
    }
  });

  tablist.onclick = function(event) {
    event.preventDefault();

    console.log(event);
    console.log(event.target);
    console.log('data close'+ event.target.getAttribute('data-close'));
    if (event.target.getAttribute('data-close') === null) {

      //console.log(event);
      //console.log(event.target);
      //console.log('update');
      chrome.tabs.update(parseInt(event.target.getAttribute('data-id')),{highlighted: true},function(){});
    } else {
      //console.log('closing');
      // console.log($(event.target).attr('data-id'));
      var index = parseInt(event.target.getAttribute('data-close'));
      chrome.tabs.remove(index, function(){});
      _removeItem(index);
      _renderList();
    }
    return true;
  };

  var _removeItem = function (index) {
    _tabs = _tabs.filter(function (ele) {
      return ele.id != index;
    });
  };

  var _renderItem = function(selected, id, icon, title){
    return '<a href="#" class="list-group-item'+((selected)?" active":"")+'" data-id="'+id+'"><span class="pull-right close" data-close="'+id+'">&times;</span><img src="'+icon+'">'+title+'</a>';
  };

  var _renderList = function () {
    var html='';
    var regex = new RegExp(_filter, 'i');

    //console.log(_tabs);
    _tabs.forEach(function (ele) {
      if (regex.test(ele.title))
        html += _renderItem(ele.selected, ele.id, ele.favIconUrl, ele.title);
    });

    tablist.innerHTML = html;
  };

  filterBox.onkeyup = function () {
    _filter = filterBox.value;
    _renderList();
  };

  filterBox.focus();
})();
