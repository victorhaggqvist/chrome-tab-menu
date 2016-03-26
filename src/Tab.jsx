import React from 'react';
import ReactDOM from 'react-dom';
import LazyLoad from 'react-lazyload';  // eslint-disable-line no-unused-vars
var classNames = require('classnames');

export default class Tab extends React.Component {

    tabClick() {
        console.log(this.props);
        chrome.tabs.update(this.props.id, {active: true}, () => {});
    }

    closeTab() {
        chrome.tabs.remove(this.props.id, () => {});
        this.props.removeTabId(this.props.id);
    }

    render() {
        const classes = {
            'list-group-item-info': this.props.selected||this.props.keyselected,
            'list-group-item': true,
            'active': this.props.active
        };

        let useIcon = this.props.favIconUrl;
        if (this.props.favIconUrl === undefined) useIcon = '';
        else if (this.props.audible) useIcon = 'volume-up.png';
        else if (useIcon.substring(0,6) === 'chrome') useIcon = '';

        return <a href="#"
                  onClick={::this.tabClick}
                  className={classNames(classes)}>
            <span
                className="pull-right close"
                onClick={::this.closeTab}>{String.fromCharCode(0x00d7)}</span>
            <LazyLoad>
                <img style={{width: 16, marginRight: 10}} src={useIcon}/>
            </LazyLoad>
            {this.props.title}
        </a>
    }

    componentDidMount() {
        this.ensureVisible();
    }

    componentDidUpdate() {
        this.ensureVisible();
    }

    ensureVisible() {
        if (this.props.keyselected || (this.props.selected && this.props.keyselectedIndex === -1)) {
            const node = ReactDOM.findDOMNode(this);
            node.scrollIntoView(false);
        }
    }

}
