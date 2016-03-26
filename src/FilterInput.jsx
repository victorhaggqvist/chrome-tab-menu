import React from 'react';

export default class FilterInput extends React.Component {

    render() {
        const style = {
            border: 0,
            borderBottom: '2px #ccc solid',
            borderRadius: 0
        };
        return <input
            style={style}
            type="text"
            className="form-control"
            placeholder="filter.."
            onKeyUp={::this.handelKey}
            autoFocus={true}
        />

    }

    handelKey(event) {
        event.persist();
        this.props.walk(event.keyCode);
        this.props.onFilterChange(event.target.value)
    }

}
