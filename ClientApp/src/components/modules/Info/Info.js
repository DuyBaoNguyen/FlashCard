import React, { Component } from 'react';

import './Info.css';

class Info extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false
		};
	}

	render() {
		let average = (this.props.data.gradePointAverage * 100).toFixed(2) + '%';
		let averageToday = (this.props.data.gradePointAverageToday * 100).toFixed(2) + '%';

		return (
			<div className="info">
				<div className="info-title">
					<h6>Statistics</h6>
				</div>
				<div className="info-field">
					<div className="info-field-item">
						<div className="info-field-item-white">Total cards:</div>
						<div className="info-field-item-orange">
							{this.props.data.totalCards}
						</div>
					</div>
					<div className="info-field-item">
						<div className="info-field-item-white">Failed cards:</div>
						<div className="info-field-item-orange">
							{this.props.data.failedCards}
						</div>
					</div>
					<div className="info-field-item">
						<div className="info-field-item-white">Average grade percent:</div>
						<div className="info-field-item-orange">
							{average}
						</div>
					</div>
					<hr/>
					<div className="info-field-item">
						<div className="info-field-item-white">Total cards today:</div>
						<div className="info-field-item-orange">
							{this.props.data.totalCardsToday}
						</div>
					</div>
					<div className="info-field-item">
						<div className="info-field-item-white">Failed cards today:</div>
						<div className="info-field-item-orange">
							{this.props.data.failedCardsToday}
						</div>
					</div>
					<div className="info-field-item">
						<div className="info-field-item-white">
							Average grade percent today:
						</div>
						<div className="info-field-item-orange">
							{averageToday}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Info;
