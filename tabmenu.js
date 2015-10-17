(function () {
    var tablist = document.querySelector('#tabs');
    var _tabs;
    var filterBox = document.querySelector('#filter');
    var _filter;
    var _key = {UP:38, DOWN:40, ENTER:13};
    var _selected = -1;
    var displayTabs = [];

    tablist.onclick = event => {
        event.preventDefault();
        //console.log('data close'+ event.target.getAttribute('data-close'));
        if (event.target.getAttribute('data-close') === null) {
            var tabId = parseInt(event.target.getAttribute('data-id'));
            chrome.tabs.update(tabId, {active: true}, function(){});
        } else {
            var index = parseInt(event.target.getAttribute('data-close'));
            chrome.tabs.remove(index, function(){});
            removeItem(index);
            renderList();
        }
        return true;
    };

    var removeItem = index => {
        _tabs = _tabs.filter(ele => ele.id != index);
    };

    var renderItem = (index, selected, id, icon, title) => {
        var ctx = 'list-group-item-info';
        var classes = 'list-group-item' + (selected ? ' active' : '');
        var itemclass = classes + (index === _selected ? ' '+ctx : '');

        var useIcon = icon;
        if (icon === undefined) useIcon = '';
        else if (icon.substring(0,6) === 'chrome') useIcon = '';

        return '<a href="#" class="'+itemclass+'" data-id="'+id+'"><span class="pull-right close" data-close="'+id+'">&times;</span><img src="'+useIcon+'">'+title+'</a>';
    };

    var renderList = function() {
        var html = '';
        var regex = new RegExp(_filter, 'i');

        displayTabs = _tabs.filter(ele => regex.test(ele.title));

        displayTabs.forEach((ele, index) => {
            html += renderItem(index, ele.active, ele.id, ele.favIconUrl, ele.title);
        });

        tablist.innerHTML = html;
        var current = document.querySelector('.list-group-item-info');
        if (current !== undefined && current !== null) {
            current.scrollIntoView(false);
        }

    };

    chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, tabs => {
        _tabs = tabs;
        renderList();
    });

    var gotoItem = function() {
        var id = _tabs[_selected].id;
        chrome.tabs.update(id,{active: true},function(){});
    };

    var handelKey = key => {
        switch (key) {
            case _key.UP:
                _selected--;
                break;
            case _key.DOWN:
                if (_tabs.length - 1 !== _selected) _selected++;
                break;
            case _key.ENTER:
                gotoItem();
        }
    };

    filterBox.onkeyup = event => {
        _filter = filterBox.value;
        handelKey(event.keyCode);
        renderList();
    };

    filterBox.focus();
})();
