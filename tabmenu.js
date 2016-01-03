// var Tab = data => {
//     return {
//         title: m.prop(data.title),
//         icon: m.prop(data.favIconUrl),
//         id: m.prop(data.id)
//     };
// };

var TabList = Array;

var TabView = {};
TabView.vm = {
    list: new TabList(),
    selected: 0,
    onLoadActive: -1
};

TabView.controller = () => {

    chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, tabs => {
        TabView.vm.list = tabs;
        // TabView.vm.list = tabs.sort((a, b) => {
        //     if (a.audible || b.audible) return 1;
        //     else return a.id > b.id;
        // });

        console.log(tabs);
        tabs.forEach(t => {
            if (t.active) TabView.vm.onLoadActive = t.id;
        });
        m.render(root, TabView.view());

        TabView.focusActiveTab(TabView.vm.onLoadActive);
    });

    // image lazy loading
    echo.init({
        unload: false
    });
}

TabView.focusActiveTab = tabId => {
    var selector = '[data-id="'+tabId+'"]';
    console.log(selector);
    var tab = document.querySelector(selector);
    tab.scrollIntoView(false);
}

TabView.view = () => {
    return m('div', [
        m('div', [
            m('input[type=text][class=form-control][id=filter][placeholder="filter..."]'),
            m('button', {class: 'btn btn-default'}, [
                m('span', {class: 'glyphicon glyphicon-cog'})
            ])
        ]),
        m('div[id=tabs]',[
            TabView.vm.list.map((item, index) => renderRow(item, index))
        ])
    ]);
};

TabView.goToTab = tabId => {
    chrome.tabs.update(tabId, {active: true}, () => {});
}

TabView.closeTab = tabId => {
    console.log('close '+tabId);
}

var NoisyTabs = {};
NoisyTabs.view = (ctrl, args) => {
    return m('div',[
        m('h1', 'Noisy Tabs'),
        args.tabs.filter(t => t.audible).map((t, i) => renderRow(t, i))
    ]);
};

var renderRow = (item, index) => {
    var ctx = 'list-group-item-info';
    var classes = 'list-group-item' + (item.active ? ' active' : '');
    var itemclass = classes + (index === TabView.vm.selected ? ' '+ctx : '');

    var useIcon = item.favIconUrl;
    if (item.favIconUrl === undefined) useIcon = '';
    else if (item.audible) useIcon = 'volume-up.png'
    else if (useIcon.substring(0,6) === 'chrome') useIcon = '';

    return m('a', {href: '#', class: itemclass, 'data-id': item.id, onclick: () => TabView.goToTab(item.id)}, [
        m('span', {class: 'pull-right close', onclick: () => TabView.closeTab(item.id)}, m.trust('&times;')),
        m('img', {'data-echo': useIcon})
    ], item.title);
};





var root = document.querySelector('#root');
m.mount(root, TabView);

window._tv = TabView;

// (function () {
//     //'use strict';

//     var tablist = document.querySelector('#tabs');
//     var _tabs;
//     var filterBox = document.querySelector('#filter');
//     // var _filter;
//     var _key = {UP:38, DOWN:40, ENTER:13};
//     var _selected = -1;
//     var displayTabs = [];

//     tablist.onclick = event => {
//         event.preventDefault();
//         //console.log('data close'+ event.target.getAttribute('data-close'));
//         if (event.target.getAttribute('data-close') === null) {
//             var tabId = parseInt(event.target.getAttribute('data-id'));
//             chrome.tabs.update(tabId, {active: true}, function(){});
//         } else {
//             var index = parseInt(event.target.getAttribute('data-close'));
//             chrome.tabs.remove(index, function(){});
//             removeItem(index);
//             renderList();
//         }
//         return true;
//     };

//     var removeItem = index => {
//         _tabs = _tabs.filter(ele => ele.id != index);
//     };

//     var renderItem = (index, tab, selected, id, icon, title) => {
//         //console.log(tab);
//         var ctx = 'list-group-item-info';
//         var classes = 'list-group-item' + (selected ? ' active' : '');
//         var itemclass = classes + (index === _selected ? ' '+ctx : '');

//         var useIcon = icon;
//         if (icon === undefined) useIcon = '';
//         else if (tab.audible) useIcon = 'volume-up.png'
//         else if (icon.substring(0,6) === 'chrome') useIcon = '';

//         return '<a href="#" class="'+itemclass+'" data-id="'+id+'"><span class="pull-right close" data-close="'+id+'">&times;</span><img src="'+useIcon+'">'+title+'</a>';
//     };

//     var renderList = function() {
//         var html = '';
//         //if (_filter !== undefined && _filter.length > 0) {
//         //var regex = new RegExp(_filter, 'i');
//         //displayTabs = _tabs.filter(ele => regex.test(ele.title));
//         //} else {
//         displayTabs = _tabs;
//         //}

//         // put tabs that make noice on top
//         // displayTabs = displayTabs.sort((a, b) => {
//         //     if (a.audible || b.audible) return 1;
//         //     else return a.id > b.id;
//         // });

//         displayTabs.forEach((ele, index) => {
//                 //console.log('ren '+index);
//             html += renderItem(index, ele, ele.active, ele.id, ele.favIconUrl, ele.title);
//         });

//         tablist.innerHTML = html;
//         //var current = document.querySelector('.list-group-item-info');
//         //if (current !== undefined && current !== null) {
//             //current.scrollIntoView(false);
//         //}

//     };


//     var gotoItem = function() {
//         var id = _tabs[_selected].id;
//         chrome.tabs.update(id,{active: true},function(){});
//     };

//     var handelKey = key => {
//         switch (key) {
//             case _key.UP:
//                 _selected--;
//                 break;
//             case _key.DOWN:
//                 if (_tabs.length - 1 !== _selected) _selected++;
//                 break;
//             case _key.ENTER:
//                 gotoItem();
//         }
//     };

//     filterBox.onkeyup = event => {
//         // _filter = filterBox.value;
//         handelKey(event.keyCode);
//         renderList();
//     };

//     filterBox.focus();


// })();
