(function () {
  var tablist = document.querySelector('#tabs');
  var _tabs;
  var filterBox = document.querySelector('#filter');
  var _filter;
  var _key = {UP:38, DOWN:40, ENTER:13};
  var _selected = -1;

  tablist.onclick = function(event) {
    event.preventDefault();

    //console.log(event);
    //console.log(event.target);
    //console.log('data close'+ event.target.getAttribute('data-close'));
    if (event.target.getAttribute('data-close') === null) {

      //console.log(event);
      //console.log(event.target);
      //console.log('update');
      chrome.tabs.update(parseInt(event.target.getAttribute('data-id')),{active: true},function(){});
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

  var _renderItem = function(index, selected, id, icon, title){
    var ctx = 'list-group-item-info';
    var classes = 'list-group-item'+((selected)?" active":"");
    var itemclass = classes+((index == _selected)? ' '+ctx:'');
    return '<a href="#" class="'+itemclass+'" data-id="'+id+'"><span class="pull-right close" data-close="'+id+'">&times;</span><img src="'+icon+'">'+title+'</a>';
  };

  var _renderList = function () {
    var html = '';
    var regex = new RegExp(_filter, 'i');

    //console.log(_tabs);
    _tabs.forEach(function (ele, index) {
      if (regex.test(ele.title))
        html += _renderItem(index, ele.active, ele.id, ele.favIconUrl, ele.title);
    });

    tablist.innerHTML = html;
    var current = document.querySelector('.list-group-item-info');
    if (current !== undefined) {
      current.scrollIntoView(false);
    }

  };

  chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs){
    _tabs = tabs;
    //console.log(tabs);
    _renderList();
  });

  var _gotoItem = function () {
    var id = _tabs[_selected].id;
    chrome.tabs.update(id,{active: true},function(){});
  };

  var _handelKey = function (key) {
    switch (key){
      case _key.UP:
        _selected--;
        break;
      case _key.DOWN:
        if(_tabs.length-1 != _selected)
          _selected++;
        break;
      case _key.ENTER:
        _gotoItem();
    }
  };

  filterBox.onkeyup = function (event) {
    _filter = filterBox.value;
    _handelKey(event.keyCode);
    _renderList();
    console.log(event);
  };

  filterBox.focus();
})();
