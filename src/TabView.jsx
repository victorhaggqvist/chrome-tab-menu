import React from 'react';
import Tab from './Tab.jsx';    // eslint-disable-line no-unused-vars

export default class TabView extends React.Component {

    render() {
        let styles = {
            width: 500,
            height: 560,
            overflowY: 'scroll'
        };
        return <div style={this.props.noisy?null:styles}>
            {this.props.tabs.map((t,i) => <Tab
                key={t.id} {...t}
                keyselected={this.props.selected === i}
                keyselectedIndex={this.props.selected}
                removeTabId={this.props.removeTabId.bind(this)} />)}
        </div>
    }

}
