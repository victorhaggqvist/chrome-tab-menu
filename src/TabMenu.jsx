import React from 'react';
import ReactDOM from 'react-dom';
import TabView from './TabView.jsx';    // eslint-disable-line no-unused-vars
import FilterInput from './FilterInput.jsx';    // eslint-disable-line no-unused-vars


class TabMenu extends React.Component { // eslint-disable-line no-unused-vars

    constructor(props) {
        super(props);
        this.state = {
            tabs: [],
            selected: -1,
            visibleTabs: []
        };

        chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, tabs => {
            this.setState({tabs}, () => {
                this.state.tabs.forEach(t => {
                    if (t.active) this.setState({onLoadActive: t.id});
                });
                this.setFilter('');
            });
        });
    }

    setFilter(val) {
        // console.log(val);
        if (val !== '') {
            var regex = new RegExp(val, 'i');
            this.setState({visibleTabs: this.state.tabs.filter(t => regex.test(t.title))});
        } else {
            this.setState({visibleTabs: this.state.tabs});
        }
    }

    removeTabId(id) {
        this.setState({tabs: this.state.tabs.filter(t => t.id != id)});
    }

    KEY = {UP:38, DOWN:40, ENTER:13};
    walk(direction) {
        switch (direction) {
        case this.KEY.UP:
            if (this.state.selected !== -1) this.setState({selected: this.state.selected - 1});
            break;
        case this.KEY.DOWN:
            if (this.state.selected === -1) this.setState({selected: 0});
            else if (this.state.selected < this.state.visibleTabs.length - 1) this.setState({selected: this.state.selected + 1});
            break;
        case this.KEY.ENTER:
            if (this.state.selected !== -1) {
                const goId = this.state.visibleTabs[this.state.selected].id;
                chrome.tabs.update(goId, {active: true}, () => {
                });
            }
        }
    }

    render() {
        return <div>
            <FilterInput onFilterChange={::this.setFilter} walk={::this.walk} />
            <TabView tabs={this.state.visibleTabs.filter(t => t.audible)} noisy={true} removeTabId={::this.removeTabId} />
            <TabView
                tabs={this.state.visibleTabs.filter(t => !t.audible)}
                selected={this.state.selected} removeTabId={::this.removeTabId} />
        </div>
    }

}

ReactDOM.render(<TabMenu/>, document.getElementById('root'));
