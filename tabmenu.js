var TabView = {};
TabView.vm = {
    list: [],
    selected: -1,
    selectedTabId: -1,
    onLoadActive: -1,
    filterBox: null,
    filter: ''
};

TabView.controller = () => {

    chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, tabs => {
        TabView.vm.list = tabs;

        // console.log(tabs);
        tabs.forEach(t => {
            if (t.active) TabView.vm.onLoadActive = t.id;
        });
        m.render(root, TabView.view());

        TabView.focusActiveTab(TabView.vm.onLoadActive);

        TabView.vm.filterBox = document.querySelector('input[type=text]');
        TabView.vm.filterBox.focus();
    });

    // image lazy loading
    echo.init({
        unload: false
    });
};

TabView.focusActiveTab = tabId => {
    var selector = '[data-id="'+tabId+'"]';
    // console.log(selector);
    var tab = document.querySelector(selector);
    if (tab !== null) tab.scrollIntoView(false);
};

TabView.view = () => {
    return m('div', [
        m('div[class=top]', [
            m('input[type=text][class=form-control][id=filter][placeholder="filter..."]', {
                onkeyup: (e) => TabView.handelKey(e)
            })
        ]),
        m('div[id=tabs]',[
            noisyTabs(TabView.vm.list),
            TabView.allTabs(TabView.vm.list)
        ])
    ]);
};

var _key = {UP:38, DOWN:40, ENTER:13};
TabView.handelKey = event => {
    TabView.vm.filter = TabView.vm.filterBox.value;

    switch (event.keyCode) {
    case _key.UP:
        if (TabView.vm.selected !== -1) TabView.vm.selected--;
        TabView.vm.selectedTabId = TabView.vm.list[TabView.vm.selected].id;
        break;
    case _key.DOWN:
        if (TabView.vm.list.length - 1 !== TabView.vm.selected) TabView.vm.selected++;
        TabView.vm.selectedTabId = TabView.vm.list[TabView.vm.selected].id;
        break;
    case _key.ENTER:
        TabView.goToTab(TabView.vm.selectedTabId);
        break;
    }

    m.render(root, TabView.view());

    if (TabView.vm.selected === -1) TabView.focusActiveTab(TabView.vm.onLoadActive);
    else document.querySelector('.list-group-item-info').scrollIntoView(false);
};

TabView.allTabs = tabs => {
    if (TabView.vm.filter === '') {
        return tabs.map((item, index) => renderRow(item, index));
    } else {
        var regex = new RegExp(TabView.vm.filter, 'i');
        return tabs
            .filter(t => regex.test(t.title))
            .map((item, index) => renderRow(item, index));
    }
};

TabView.goToTab = tabId => {
    chrome.tabs.update(tabId, {active: true}, () => {});
};

TabView.closeTab = tabId => {
    console.log('close '+tabId);
};

var noisyTabs = tabs => {
    tabs = tabs.filter(t => t.audible);
    if (tabs.length > 0) {
        return m('div',[
            m('li[class="list-group-item list-group-item-danger"]', 'Noisy'),
            tabs.filter(t => t.audible).map((t, i) => renderRow(t, i)),
            m('li[class="list-group-item"]', '')
        ]);
    } else {
        return m('div');
    }
};

var renderRow = (item, index) => {
    var ctx = 'list-group-item-info';
    var classes = 'list-group-item' + (item.active ? ' active' : '');
    var itemclass = classes + (index === TabView.vm.selected ? ' '+ctx : '');

    var useIcon = item.favIconUrl;
    if (item.favIconUrl === undefined) useIcon = '';
    else if (item.audible) useIcon = 'volume-up.png';
    else if (useIcon.substring(0,6) === 'chrome') useIcon = '';

    return m('a', {href: '#', class: itemclass, 'data-id': item.id, onclick: () => TabView.goToTab(item.id)}, [
        m('span', {class: 'pull-right close', onclick: () => TabView.closeTab(item.id)}, m.trust('&times;')),
        m('img', {'data-echo': useIcon})
    ], item.title);
};

var root = document.querySelector('#root');
m.mount(root, TabView);
