import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './Statistics.css';

class Statistics extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			hasError: false,
		};
	}

	render() {
		if (this.state.hasError) {
			return <h1>Something went wrong.</h1>;
		}
		return (
			<div className="statistics-wrapper">
				<div className="statistics-header">
					<p>Statistics</p>
				</div>
				<div className="statistics-info">
					<div className="statistics-info-name">Lorem</div>
					<div className="statistics-info-value">123</div>
				</div>
        <div className="statistics-info">
					<div className="statistics-info-name">Lorem</div>
					<div className="statistics-info-value">123</div>
				</div>
        <div className="statistics-info">
					<div className="statistics-info-name">Lorem</div>
					<div className="statistics-info-value">123</div>
				</div>
        <div className="statistics-info">
					<div className="statistics-info-name">Lorem</div>
					<div className="statistics-info-value">123</div>
				</div>
			</div>
		);
	}
}

export default Statistics;
